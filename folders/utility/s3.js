const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const s3params = {
    Bucket: process.env.AWS_BUCKET_NAME
};

const listS3Files = new ListObjectsV2Command(s3params);

module.exports = { s3, s3params, listS3Files };