const Blog = require('../models/blog.model');

exports.createBlog = async (blog) => {
    const blogs = new Blog(blog);
    return await blogs.save();
}

exports.getBlogs = async (page, limit) => {
    return await Blog.find().skip(page).limit(limit == -1 ? 0 : limit);
}

exports.getBlogById = async (id) => {
    return await Blog.findById(id)
}

exports.updateBlog = async (id, blog) => {
    return await Blog.findByIdAndUpdate(id, blog, { new: true })
}

exports.deleteBlog = async (id) => {
    return await Blog.findByIdAndDelete(id)
}