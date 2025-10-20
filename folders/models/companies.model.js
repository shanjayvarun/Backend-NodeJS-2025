const mongoose = require("mongoose")

const companiesSchema = new mongoose.Schema(
    {
        name: { type: String, default: null },
        owner: { type: String, default: null },
        type: { type: String, default: null },
        rating: { type: Number, default: 0 },
        location: { type: String, default: null },
        description: { type: String, default: null },
        logo: { type: String, default: null },
        website: { type: String, default: null },
        email: { type: String, default: null, unique: true },
        phoneNumber: { type: Number, default: null },
        totalEmployees: { type: String, default: null },
        DOI: { type: String, default: null },
        status: { type: String, default: 'active' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Companies', companiesSchema)