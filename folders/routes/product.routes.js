const express = require('express');
const { validateUserToken, validateProductCreation } = require('../middlewares/validation.middleware');
const productControlller = require('../controllers/product.controller')

const router = express.Router();

router.post("/add-product", validateUserToken, validateProductCreation, productControlller.addProduct);
router.get("/get-products", validateUserToken, productControlller.getProducts);
router.get("/get-products/:id", validateUserToken, productControlller.getProducts);
router.patch("/update-product/:id", validateUserToken, productControlller.updateProduct);
router.delete("/delete-product/:id", validateUserToken, productControlller.deleteProduct);
router.patch("/like-product/:id", validateUserToken, productControlller.likeProduct);
// router.patch("/review-product/:id", validateUserToken, productControlller.reviewProduct)
router.patch("/add-to-cart", validateUserToken)

module.exports = router;