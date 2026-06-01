/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-extraneous-require */
const { randomUUID } = require('crypto');
const { buildUserItem } = require('../models/user.model');
const { DocumentClient } = require('../config/dynamo');
const { QueryCommand, PutCommand, GetCommand, DeleteCommand, UpdateCommand, ScanCommand, BatchGetCommand, BatchWriteCommand, TransactWriteCommand } = require('@aws-sdk/lib-dynamodb');
const { request } = require('http');
const { error } = require('console');

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

exports.saveUser = async (data) => {
  const user = await exports.getUserByEmail(data.email)
  if (user) return null
  const userData = Object.assign({}, data);
  const newUser = buildUserItem(Object.assign({ id: randomUUID() }, userData));
  await DocumentClient.send(new PutCommand({
    TableName: 'CRMS-DEV-USERS',
    Item: newUser,
  }))
  return hideSensitiveData(newUser)
}

exports.updateUser = async (id, data) => {
  let updates = Object.assign({}, data)
  updates.updatedAt = new Date().toISOString()
  delete updates.id
  let keys = Object.keys(updates)
  let modifiedUpdateExpression = keys.map((k, i) => '#k' + i + '= :v' + i)
  let DynamicNames = {};
  let DynamicValues = {};
  keys.forEach((k, i) => {
    DynamicNames['#k' + i] = k;
    DynamicValues[':v' + i] = updates[k]
  })
  const result = await DocumentClient.send(new UpdateCommand({
    TableName: 'CRMS-DEV-USERS',
    Key: { id },
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: 'SET ' + modifiedUpdateExpression.join(', '),
    ExpressionAttributeNames: DynamicNames,
    ExpressionAttributeValues: DynamicValues,
    ReturnValues: 'ALL_NEW'
  }))
  return hideSensitiveData(result.Attributes)
}

exports.deleteUserById = async (id) => {
  const result = await DocumentClient.send(new DeleteCommand({
    TableName: 'CRMS-DEV-USERS',
    Key: { id },
    ReturnValues: 'ALL_OLD'
  }))
  return hideSensitiveData(result.Attributes)
}

exports.bulkInsertUsers = async (users) => {
  const chunks = [];
  const chunkSize = 25;
  const maxRetries = 5;
  for (let i = 0; i < users.length; i += chunkSize) {
    chunks.push(users.slice(i, i + chunkSize))
  }
  for (let chunk of chunks) {
    let modifyReqItems = chunk.map((user) => ({
      PutRequest: {
        Item: user
      }
    }))
    let retryCount = 0;
    while (retryCount < maxRetries && modifyReqItems.length > 0) {
      const result = await DocumentClient.send(new BatchWriteCommand({
        RequestItems: {
          'CRMS-DEV-USERS': modifyReqItems
        }
      }))
      modifyReqItems = result.UnprocessedItems?.['CRMS-DEV-USERS'] || []
      if (modifyReqItems.length === 0) break
      await new Promise((resolve) => setTimeout(() => {
        resolve()
      }, 100 * Math.pow(2, retryCount)))
      retryCount++
    }
    if (modifyReqItems.length > 0) {
      throw new Error('Failed to process items')
    }
  }
  return {
    success: true,
    count: users.length
  }
}

exports.createUserWithAudit = async (user, log) => {
  await DocumentClient.send(new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: 'CRMS-DEV-USERS',
          Item: user,
          ConditionExpression: 'attribute_not_exists(id)'
        }
      },
      {
        Put: {
          TableName: 'CRMS-DEV-AUDIT-LOGS',
          Item: log
        }
      }
    ]
  }))
  return hideSensitiveData(user)
}

exports.getAllUsers = async (lastEvaluatedKey, limit) => {
  const result = await DocumentClient.send(new ScanCommand({
    TableName: 'CRMS-AUTH-DEV',
    ExclusiveStartKey: lastEvaluatedKey,
    Limit: limit ?? 20
  }))
  return {
    items: (result.Items || []).map(hideSensitiveData),
    nextPage: result.LastEvaluatedKey
  }
}

exports.getUserByIds = async (arr) => {
  let groupIds = arr.map((id) => ({ id }))
  const result = await DocumentClient.send(new BatchGetCommand({
    RequestItems: {
      'CRMS-DEV-USERS': {
        Keys: groupIds
      }
    }
  }))
  return (result.Responses?.['CRMS-DEV-USERS'] || []).map(hideSensitiveData)
}































// HELPERS
exports.getUserByEmail = async (email) => {
  const result = await DocumentClient.send(new QueryCommand({
    TableName: 'CRMS-DEV-USERS',
    IndexName: 'email-index',
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':email': email
    }
  }))
  return result.Items?.[0] || null
}

exports.getUserById = async (id) => {
  const result = await DocumentClient.send(new GetCommand({
    TableName: 'CRMS-DEV-USERS',
    Key: { id }
  }))
  return hideSensitiveData(result.Item)
}
