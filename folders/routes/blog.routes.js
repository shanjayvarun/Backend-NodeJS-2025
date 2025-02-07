const express = require('express');
const blogController = require('../controllers/blog.controller');
const { validateToken, validateBlogCreation } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/create-blog", validateBlogCreation, validateToken, blogController.createBlog);

module.exports = router;