const Companies = require('../models/companies.model');

exports.createCompany = async (data) => {
    return await Companies(data).save()
}

exports.getAllCompanies = async (query, skip, limit) => {
    const companies = await Companies.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit == -1 ? 0 : limit).lean();
    const count = await Companies.countDocuments()
    return { companies, count }
}

exports.getCompanyById = async (id) => {
    return await Companies.findById(id)
}

exports.updateCompany = async (id, data) => {
    return await Companies.findByIdAndUpdate(id, data, { new: true, overwrite: false })
}

exports.deleteCompany = async (id) => {
    return await Companies.findByIdAndDelete(id)
}