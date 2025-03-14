const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        images: [{ type: String }],
        inStock: { type: Boolean, default: true },
        quantity: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        ratings: { type: Number, default: 0 },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                comment: { type: String },
                rating: { type: Number }
            }
        ],
        createdAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('Product', productSchema);
