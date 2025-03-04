const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
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

const s3params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: ``
};

const listS3Files = new ListObjectsV2Command(s3params);

const ALLOWEDTYPES = ['jpeg', 'png', 'jpg', 'svg', 'csv', 'xls', 'xlsx', 'pdf', 'mp4', 'mov', 'mkv', 'flv'];

module.exports = { TASKSTATUS, ROLES, ALLOWEDTYPES, s3, s3params, listS3Files };