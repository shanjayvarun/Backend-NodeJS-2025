const mongoose = require('mongoose');
const { TASKSTATUS } = require("../utility/enum");

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: Object.values(TASKSTATUS), default: 'PENDING' },
        dueDate: { type: Date },
    },
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('Task', taskSchema);
