const upload = require('../../config/upload-file.config');
const { sendSuccessUpdateOrDelete, sendError, sendSuccessGet } = require('../utility/responses');
const { s3, s3params, listS3Files } = require("../utility/s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

exports.uploadFile = (req, res) => {
    upload.single('file')(req, res, (error) => {
        return error ? sendError(res, 400, error.message) : sendSuccessUpdateOrDelete(res, { url: req.file.location }, 'Image uploaded successfully');
    });
};

exports.getFiles = async (req, res) => {
    try {
        s3params.Prefix = `${req.query.folder}/${req.query.subfolder}`;
        s3params.MaxKeys = req.query.limit || 10;
        const data = await s3.send(listS3Files)
        if (!data.Contents) return sendError(res, 404, 'Files not found');
        const s3ObjectList = data.Contents.map(file => ({ Key: file.Key, Size: file.Size, LastModified: file.LastModified }));
        return sendSuccessGet(res, { s3ObjectList, totalCount: data.Contents.length }, 'Files fetched successfully');
    } catch (error) {
        sendError(res, 400, error.message);
    }
}

exports.downloadFile = async (req, res) => {
    try {
        s3params.Prefix = `${req.query.folder}/${req.query.subfolder}/${req.query.id}`;
        const data = await s3.send(listS3Files)
        if (!data.Contents[0].Key) return sendError(res, 404, 'File not found');
        s3params.Key = data.Contents[0].Key
        const command = new GetObjectCommand(s3params);
        const url = await getSignedUrl(s3, command, { expiresIn: 10 }); // current expire time is 10 seconds
        return sendSuccessGet(res, { url }, 'File download link generated successfully');
    } catch (error) {
        return sendError(res, 404, 'File not found');
    }
};