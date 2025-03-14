const express = require('express');
const { validateToken } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/create-product", validateToken, blogController.createBlog);
router.get("/get-products", validateToken, blogController.getBlogs);
router.patch("/update-product/:id", validateToken, blogController.updateBlog);
router.delete("/delete-product/:id", validateToken, blogController.deleteBlog);

module.exports = router;