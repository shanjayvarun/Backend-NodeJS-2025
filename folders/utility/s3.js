const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const environment = require('../../config/env.config')

const s3 = new S3Client({
    region: environment.aws.region,
    credentials: {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
    }
});

const s3params = {
    Bucket: environment.aws.bucket
};

const listS3Files = new ListObjectsV2Command(s3params);

module.exports = { s3, s3params, listS3Files };