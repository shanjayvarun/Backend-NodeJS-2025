const express = require('express');
const blogController = require('../controllers/blog.controller');
const { validateToken, validateBlogCreation } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/create-blog", validateBlogCreation, validateToken, blogController.createBlog);
router.get("/get-blogs", validateToken, blogController.getBlogs);
router.get("/get-blog/:id", validateToken, blogController.getBlogs);
router.put("/update-blog/:id", validateToken, blogController.updateBlog);
router.delete("/delete-blog/:id", validateToken, blogController.deleteBlog);

module.exports = router;