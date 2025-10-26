const mongoose = require('mongoose')

const tagShema = new mongoose.Schema(
    {
        value: { type: String, required: true }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('tags', tagShema)