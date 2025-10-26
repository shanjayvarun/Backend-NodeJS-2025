const Tags = require("../models/tags.model")

exports.getTags = async (skip, limit) => {
    return await Tags.find().skip(skip == -1 ? 0 : skip).limit(limit).lean()
}

exports.createTag = async (data) => {
    return await Tags(data).save()
}