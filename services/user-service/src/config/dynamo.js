/* eslint-disable node/no-extraneous-require */
/* eslint-disable node/no-extraneous-import */
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb")

const DDBClient = new DynamoDBClient({
    region: 'us-east-1'
});

const DocumentClient = DynamoDBDocumentClient.from(DDBClient)

module.exports = { DocumentClient }