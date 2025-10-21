const Companies = require('../models/companies.model');

exports.createCompany = async (data) => {
    return await Companies(data).save()
}

exports.getAllCompanies = async (query, skip, limit) => {
    const companies = await Companies.find(query).populate('createdBy', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(limit == -1 ? 0 : limit).lean();
    const count = companies.length
    return { companies, count }
}

exports.getCompanyById = async (id) => {
    return await Companies.findById(id).populate('createdBy', 'name email role').lean()
}

exports.updateCompany = async (id, data) => {
    return await Companies.findByIdAndUpdate(id, data, { new: true, overwrite: false })
}

exports.softDeleteCompany = async (id) => {
    return await Companies.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
}