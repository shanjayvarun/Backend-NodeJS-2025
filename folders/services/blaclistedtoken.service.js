const BlackListedToken = require("../models/blacklistedtokens.model")

exports.saveBlackListedTokens = async (data) => {
    return await new BlackListedToken(data).save();
}

exports.getBlackListedTokenByAccessToken = async (token) => {
    return await BlackListedToken.findOne(token)
}