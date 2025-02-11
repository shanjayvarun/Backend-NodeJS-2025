const express = require('express');
const blogController = require('../controllers/blog.controller');
const { validateToken, validateBlogCreation } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/create-blog", validateBlogCreation, validateToken, blogController.createBlog);
router.get("/get-blogs", validateToken, blogController.getBlogs);
router.get("/get-blog/:id", validateToken, blogController.getBlogs);
router.patch("/update-blog/:id", validateToken, blogController.updateBlog);
router.delete("/delete-blog/:id", validateToken, blogController.deleteBlog);
router.patch("/like-blog/:id", validateToken, blogController.likeBlog);
router.patch("/comment-blog/:id", validateToken, blogController.commentBlog);
router.get("/get-blog-likes-comments/:id", validateToken, blogController.likesAndCommmentsCountById);

module.exports = router;