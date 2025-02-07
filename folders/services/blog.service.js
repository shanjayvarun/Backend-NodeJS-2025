const Blog = require('../models/blog.model');

exports.createBlog = async (blog) => {
    const blogs = new Blog(blog);
    return await blogs.save();
}

exports.getBlogs = async () => {
    return await Blog.find()
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