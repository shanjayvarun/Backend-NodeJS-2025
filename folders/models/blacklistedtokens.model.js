const mongoose = require("mongoose")

const blackListedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
})

// Implemented TTL ( Time to Leave Index ) here.
blackListedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
// 1 is ascending index value of that feild ( eg: expiresAt), expireAfterSeconds is after how many seconds from the time period given, the data should be deleted from the collection.

module.exports = mongoose.model('Blacklisted Tokens', blackListedTokenSchema)