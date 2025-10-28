const mongoose = require("mongoose")
const { DEALSTAGES, DEALSTATUSFLAGS } = require("../utility/enum")

const dealSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
        lead: { type: mongoose.Schema.Types.ObjectId, ref: "Leads" },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        stage: { type: String, enum: DEALSTAGES, default: "Lead Discovered" },
        phoneNumber: { type: String, default: null, trim: true },
        expectedCloseDate: { type: Date },
        closedDate: { type: Date },
        status: { type: String, enum: DEALSTATUSFLAGS, default: "open" },
        description: { type: String },
        tags: [{ type: String }],
        rating: { type: Number, default: 0 },
        dealScore: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

dealSchema.index({ createdAt: -1 });
dealSchema.index({ stage: 1 });
dealSchema.index({ status: 1 });
dealSchema.index({ amount: 1 });

module.exports = mongoose.model('Deals', dealSchema)