const { sendSuccessUpdateOrDelete, sendError } = require('../utility/responses');

exports.uploadImage = async (req, res) => {
    try {
        req?.file?.location ? sendSuccessUpdateOrDelete(res, { profilePicture: req.file.location }, 'Image uploaded successfully') : sendError(res, 400, 'Failed to upload image');
    } catch (error) {
        sendError(res, 500, 'Failed to upload image');
    }
};