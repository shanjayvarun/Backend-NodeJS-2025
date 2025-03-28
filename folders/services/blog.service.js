const Blog = require('../models/blog.model');

exports.createBlog = async (blog) => {
    return await new Blog(blog).save();
}

exports.getBlogs = async (skip, limit) => {
    return await Blog.find().skip(skip).limit(limit == -1 ? 0 : limit);
}

exports.getBlogById = async (id) => {
    return await Blog.findById(id)
}

exports.updateBlog = async (id, blog) => {
    return await Blog.findByIdAndUpdate(id, { $set: blog }, { new: true, runValidators: true })
}

exports.deleteBlog = async (id) => {
    return await Blog.findByIdAndDelete(id)
}