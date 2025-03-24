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

exports.deleteProduct = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id)
        return product ? sendSuccessUpdateOrDelete(res, "Product deleted successfully") : sendError(res, 404, 'No products found')
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.likeProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id)
        if (!product) return sendError(res, 404, 'No products found')
        const isLiked = product.likes.includes(req.user.id)
        isLiked ? product.likes.pull(req.user.id) : product.likes.push(req.user.id)
        await product.save()
        return sendSuccessNoContent(res)
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

// exports.reviewProduct = async (req, res) => {
//     try {
//         const product = await productService.getProductById(req.params.id)
//         if (!product) return sendError(res, 404, 'No products found')
//         product.reviews.push({ user: req.user._id, comment: req.body.comment, rating: req.body.rating })
//         await product.save()
//         return sendSuccessNoContent(res)
//     } catch (error) {
//         return sendError(error, 500, error.message);
//     }
// }