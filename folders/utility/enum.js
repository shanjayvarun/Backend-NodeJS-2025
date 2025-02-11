const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const TASKSTATUS = {
    NEW: 'NEW',
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED'
}

const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
};

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const s3Bucket = process.env.AWS_BUCKET_NAME;

const ALLOWEDTYPES = ['jpeg', ' png', ' jpg', ' svg', ' csv', ' xls', ' xlsx', ' pdf'];

module.exports = { TASKSTATUS, ROLES, s3, s3Bucket, ALLOWEDTYPES };