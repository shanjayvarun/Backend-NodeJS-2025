const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productName: { type: String, required: true },
        description: { type: String },
        category: { type: String, required: true },
        images: [{ type: String }],
        inStock: { type: Boolean, default: true },
        quantity: { type: Number, default: 0 },
        price: { type: Number, required: true, min: 0 },
        ratings: { type: Number, default: 0, min: 0, max: 5 },
        discount: { type: Number, default: 0, min: 0, max: 100 },
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

//to Query the Data Faster, Use Indexes of a Feild
productSchema.index({ category: 1, productName: 1 });
productSchema.index({ price: 1 });

productSchema.virtual('likesCount').get(function () { return this.likes.length });
productSchema.virtual('reviewsCount').get(function () { return this.reviews.length });

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
