const upload = require('../../config/upload-file.config');
const { sendSuccessUpdateOrDelete, sendError } = require('../utility/responses');

exports.uploadFile = (req, res) => {
    upload.single('file')(req, res, (error) => {
        return error ? sendError(res, 400, error.message) : sendSuccessUpdateOrDelete(res, { profilePicture: req.file.location }, 'Image uploaded successfully');
    });
};

exports.getFiles = (req, res) => {
    upload.listObjects((error, data) => {
        return error ? sendError(res, 400, error.message) : sendSuccessUpdateOrDelete(res, data, 'Files fetched successfully');;
    });
}