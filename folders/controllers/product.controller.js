const { sendSuccessPost, sendError, sendSuccessGet, sendSuccessUpdateOrDelete, sendSuccessNoContent } = require("../utility/responses");
const productService = require('../services/product.service')

exports.addProduct = async (req, res) => {
    try {
        const product = await productService.addProduct(req.body)
        product ? sendSuccessPost(res, product, 'Product added successfully') : sendError(res, 400, 'Failed to add a product')
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = req.params.id ? await productService.getProductById(req.params.id) : await productService.getProducts(req.query.page, req.query.limit);
        return products ? sendSuccessGet(res, { [req.params.id ? 'product' : 'products']: products, totalCount: products.length }, 'Products fetched successfully') : sendError(res, 404, 'No Products found');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        return product ? sendSuccessUpdateOrDelete(res, "Product updated successfully") : sendError(res, 404, 'No products found')
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}