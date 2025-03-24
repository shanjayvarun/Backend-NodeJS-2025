const express = require('express');
const blogController = require('../controllers/blog.controller');
const { validateUserToken, validateBlogCreation } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/create-blog", validateBlogCreation, validateUserToken, blogController.createBlog);
router.get("/get-blogs", validateUserToken, blogController.getBlogs);
router.get("/get-blog/:id", validateUserToken, blogController.getBlogs);
router.patch("/update-blog/:id", validateUserToken, blogController.updateBlog);
router.delete("/delete-blog/:id", validateUserToken, blogController.deleteBlog);
router.patch("/like-blog/:id", validateUserToken, blogController.likeBlog);
router.patch("/comment-blog/:id", validateUserToken, blogController.commentBlog);
router.get("/get-blog-likes-comments/:id", validateUserToken, blogController.likesAndCommmentsCountById);

module.exports = router;