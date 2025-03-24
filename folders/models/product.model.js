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
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

productSchema.virtual('likesCount').get(function () { return this.likes.length });
productSchema.virtual('reviewsCount').get(function () { return this.reviews.length });

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
