const { sendSuccessPost, sendError, sendSuccessGet, sendSuccessUpdateOrDelete } = require("../utility/responses");
const blogService = require("../services/blog.service");

exports.createBlog = async (req, res) => {
    try {
        const blogs = await blogService.createBlog(req.body);
        blogs ? sendSuccessPost(res, blogs, 'Blog created successfully') : sendError(res, 400, 'Failed to create blog');
    } catch (error) {
        sendError(res, 500, error.message);
    }
}