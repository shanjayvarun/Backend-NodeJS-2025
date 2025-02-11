const { sendSuccessPost, sendError, sendSuccessGet, sendSuccessUpdateOrDelete } = require("../utility/responses");
const blogService = require("../services/blog.service");

exports.createBlog = async (req, res) => {
    try {
        const blogs = await blogService.createBlog(req.body);
        blogs ? sendSuccessPost(res, blogs, 'Blog created successfully') : sendError(res, 400, 'Failed to create blog');
    } catch (error) {
        if (error.code == 11000) {
            return sendError(res, 409, 'Blog already exists');
        }
        sendError(res, 500, error.message);
    }
}

exports.getBlogs = async (req, res) => {
    try {
        const blogs = req.params.id ? await blogService.getBlogById(req.params.id) : await blogService.getBlogs(req.query.page, req.query.limit);
        return blogs ? sendSuccessGet(res, { [req.params.id ? 'blog' : 'blogs']: blogs, totalCount: blogs.length }, 'Blogs fetched successfully') : sendError(res, 404, 'No blogs found');
    } catch (error) {
        return sendError(error, 400, error.message);
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const blog = await blogService.updateBlog(req.params.id, req.body);
        if (blog) {
            sendSuccessUpdateOrDelete(res, 'Blog updated successfully')
        } else {
            sendError(res, 404, 'No blog found')
        }
    } catch (error) {
        sendError(error, 400, 'Failed to update blog');
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await blogService.deleteBlog(req.params.id);
        blog ? sendSuccessUpdateOrDelete(res, 'Blog deleted successfully') :  sendError(res, 404, 'No blog found')
    } catch (error) {
        sendError(error, 400, 'Failed to update blog');
    }
}