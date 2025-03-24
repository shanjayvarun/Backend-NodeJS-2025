const { sendSuccessPost, sendError, sendSuccessGet, sendSuccessUpdateOrDelete, sendSuccessNoContent } = require("../utility/responses");
const blogService = require("../services/blog.service");

exports.createBlog = async (req, res) => {
    try {
        const blogs = await blogService.createBlog(req.body);
        blogs ? sendSuccessPost(res, blogs, 'Blog created successfully') : sendError(res, 400, 'Failed to create blog');
    } catch (error) {
        if (error.code == 11000) {
            return sendError(res, 409, 'Blog already exists');
        }
        return sendError(error, 500, error.message);
    }
}

exports.getBlogs = async (req, res) => {
    try {
        const blogs = req.params.id ? await blogService.getBlogById(req.params.id) : await blogService.getBlogs(req.query.page, req.query.limit);
        return blogs ? sendSuccessGet(res, { [req.params.id ? 'blog' : 'blogs']: blogs, totalCount: blogs.length }, 'Blogs fetched successfully') : sendError(res, 404, 'No blogs found');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const blog = await blogService.updateBlog(req.params.id, req.body);
        blog ? sendSuccessUpdateOrDelete(res, 'Blog updated successfully') : sendError(res, 404, 'No blog found')
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await blogService.deleteBlog(req.params.id);
        blog ? sendSuccessUpdateOrDelete(res, 'Blog deleted successfully') : sendError(res, 404, 'No blog found')
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.likeBlog = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        if (blog) {
            const isLiked = blog.likes.includes(req.user.id)
            isLiked ? blog.likes.pull(req.user.id) : blog.likes.push(req.user.id)
            await blog.save()
            return sendSuccessNoContent(res)
        } else {
            return sendError(res, 404, 'No blog found')
        }
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.commentBlog = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        if (blog) {
            const newComment = { user: req.user.id, text: req.body.text };
            blog.comments.push(newComment);
            await blog.save();
            return sendSuccessNoContent(res)
        } else {
            return sendError(res, 404, 'No blog found')
        }
    } catch (error) {
        return sendError(error, 500, error.message);
    }
};

exports.likesAndCommmentsCountById = async (req, res) => {
    try {
        const blog = await blogService.getBlogById(req.params.id)
        if (blog) {
            let data = {}
            data.likes = blog.likes
            data.likesCount = blog.likes.length
            data.comments = blog.comments
            data.commentsCount = blog.comments.length
            return sendSuccessGet(res, data, `Blog number ${blog.id} fetched successfully`)
        } else {
            return sendError(res, 404, 'No blog found')
        }
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}
