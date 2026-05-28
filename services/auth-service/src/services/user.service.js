const { randomUUID } = require('crypto');
const { GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand, BatchGetCommand, BatchWriteCommand, TransactGetCommand, TransactWriteCommand} = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../config/dynamo');
const { dynamodbUsersTable: TABLE_NAME } = require('../config/env');
const { buildUserItem } = require('../models/user.model');

// Remove sensitive fields from user object
const hideSensitiveData = (user) => {
  if (!user) return null;
  const safe = {};
  Object.keys(user).forEach((key) => {
    if (key !== 'password' && key !== 'refreshToken') {
      safe[key] = user[key];
    }
  });
  return safe;
};

// Save new user to DynamoDB
exports.saveUser = async (data) => {
  const userData = Object.assign({}, data);
  const newUser = buildUserItem(Object.assign({ id: randomUUID() }, userData));

  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: newUser,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );
    return newUser;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

// Get user by email (using GSI)
exports.findOneByEmail = async (email) => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    })
  );
  return (result.Items && result.Items[0]) || null;
};

// Get user by ID (primary key lookup)
exports.getUserById = async (id) => {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id: id },
    })
  );
  return result.Item || null;
};

// Get user by ID with refresh token
exports.getUserByIdWithRefreshToken = async (id) => {
  return await exports.getUserById(id);
};

// Update user by ID
exports.updateUser = async (id, updateData) => {
  const user = await exports.getUserById(id);
  if (!user) return null;

  const updates = Object.assign({}, updateData);
  delete updates.id
  updates.updatedAt = new Date().toISOString();

  const keys = Object.keys(updates);
  if (keys.length === 0) return user
  const updateExpressionParts = keys.map((k, i) => '#k' + i + ' = :v' + i);
  const names = {};
  const values = {};
  keys.forEach((k, i) => {
    names['#k' + i] = k;
    values[':v' + i] = updates[k];
  });
  const result = await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id: id },
    UpdateExpression: 'SET ' + updateExpressionParts.join(', '),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW',
  }));
  return result.Attributes || null;
};

// Update password by email
exports.changePasswordByEmail = async (email, hashedPassword) => {
  const user = await exports.findOneByEmail(email);
  if (!user) return null;

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id: user.id },
      UpdateExpression: 'SET #password = :password, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#password': 'password',
        '#updatedAt': 'updatedAt',
      },
      ExpressionAttributeValues: {
        ':password': hashedPassword,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    })
  );
  return result.Attributes || null;
};

exports.changePasswordByEmaila = async (email, hashedPassword) => {
  const user = await exports.findOneByEmail(email);
  if (!user) return null
  const result = await docClient.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id: user.id },
    UpdateExpression: 'SET #password = :password, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#password': 'password',
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':password': hashedPassword,
      ':updatedAt': new Date().toISOString()
    },
    ReturnValues: 'ALL_NEW'
  }))
  return result.Attributes || null
}

// Delete user by ID
exports.deleteUser = async (id) => {
  const user = await exports.getUserById(id);
  if (!user) return null;

  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id: id },
    })
  );

  return hideSensitiveData(user);
};
