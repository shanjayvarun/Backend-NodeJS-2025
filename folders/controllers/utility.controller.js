const upload = require('../../config/upload-file.config');
const { sendSuccessUpdateOrDelete, sendError, sendSuccessGet } = require('../utility/responses');
const { s3, s3params, listS3Files } = require("../utility/enum");

exports.uploadFile = (req, res) => {
    upload.single('file')(req, res, (error) => {
        return error ? sendError(res, 400, error.message) : sendSuccessUpdateOrDelete(res, { profilePicture: req.file.location }, 'Image uploaded successfully');
    });
};

exports.getFiles = async (req, res) => {
    try {
        s3params.Prefix = `${req.query.folder}/${req.query.subfolder}`;
        const data = await s3.send(listS3Files)
        if (!data.Contents) return sendError(res, 404, 'Files not found');
        const keys = data.Contents.filter((file) => file.Key)
        return sendSuccessGet(res, { keys: keys, totalCount: data.Contents.length }, 'Files fetched successfully');
    } catch (error) {
        sendError(res, 400, error.message);
    }
}