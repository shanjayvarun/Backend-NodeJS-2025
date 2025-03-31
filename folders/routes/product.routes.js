const express = require('express');
const { validateUserToken, validateProductCreation } = require('../middlewares/validation.middleware');
const productControlller = require('../controllers/product.controller');
const { checkRole } = require('../middlewares/roles.middleware');
const { ROLES } = require('../utility/enum');

const router = express.Router();

router.post("/add-product", validateUserToken, validateProductCreation, checkRole([ROLES.ADMIN]), productControlller.addProduct);
router.get("/get-products", validateUserToken, productControlller.getProducts);
router.get("/get-products/:id", validateUserToken, productControlller.getProducts);
router.patch("/update-product/:id", validateUserToken, productControlller.updateProduct);
router.delete("/delete-product/:id", validateUserToken, checkRole([ROLES.ADMIN]), productControlller.deleteProduct);
router.patch("/like-product/:id", validateUserToken, productControlller.likeProduct);
router.patch("/review-product/:id", validateUserToken, productControlller.reviewProduct)
// router.patch("/add-to-cart", validateUserToken)

module.exports = router;