const express = require('express');
const { validateToken } = require('../middlewares/validation.middleware');
const productControlller = require('../controllers/product.controller')

const router = express.Router();

router.post("/create-product", validateToken, productControlller);
router.get("/get-products", validateToken, productControlller);
router.patch("/update-product/:id", validateToken, productControlller);
router.delete("/delete-product/:id", validateToken, productControlller);

module.exports = router;