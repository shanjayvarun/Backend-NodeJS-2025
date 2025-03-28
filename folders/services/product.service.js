const Product = require('../models/product.model');

exports.addProduct = async (product) => {
    return await new Product(product).save();
}

exports.getProductById = async (id) => {
    return await Product.findById(id).populate('reviews.user', 'name email');
}

exports.getProducts = async (filter, sort, skip, limit) => {
    return await Product.find(filter).sort(sort).skip(skip).limit(limit == -1 ? 0 : limit).populate('reviews.user', 'name email');
}

exports.updateProduct = async (id, body) => {
    return await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: false })
}

exports.deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id)
}