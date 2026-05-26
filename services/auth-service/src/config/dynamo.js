const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const environment = require('./env');

const ddbClient = new DynamoDBClient({
  region: environment.awsRegion || 'us-east-1',
});

const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

module.exports = { ddbClient, docClient };
