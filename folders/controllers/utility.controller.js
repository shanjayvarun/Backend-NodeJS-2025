const { sendSuccessPost, sendError } = require('../utility/responses');

exports.uploadImage = async (req, res) => {
    try {
        if (req?.file?.location) {
            sendSuccessPost(res, { profilePicture: req.file.location }, 'Image uploaded successfully');
        } else {
            sendError(res, 400, 'Failed to upload image');
        }
    } catch (error) {
        sendError(res, 500, 'Failed to upload image');
    }
};