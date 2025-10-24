const mongoose = require('mongoose')
const { LEADSTATUS } = require('../utility/enum')

const LeadSchema = new mongoose.Schema(
    {
        name: { type: String, default: null, required: true },
        companyName: { type: String, default: null },
        logo: { type: String, default: null },
        email: { type: String, trim: true, lowercase: true },
        leadsScore: { type: Number, default: 0 },
        phoneNumber: { type: String, default: null, trim: true },
        location: { type: String, default: null },
        source: { type: String, default: null },
        tags: [{ type: String }],
        status: { type: String, enum: LEADSTATUS, default: 'New' },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String, default: null },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Companies' },
        isExempted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Leads', LeadSchema)