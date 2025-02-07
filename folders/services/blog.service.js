const Blog = require('../models/blog.model');

exports.createBlog = async (blog) => {
    const blogs = new Blog(blog);
    return await blogs.save();
}