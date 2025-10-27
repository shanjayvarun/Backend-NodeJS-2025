const Companies = require('../models/companies.model');

exports.createCompany = async (data) => {
    return await new Companies(data).save()
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

exports.getCompanyStats = async () => {
    let result = {};
    const totalCompanies = await Companies.countDocuments();
    const stats = await Companies.aggregate([
        {
            $facet: {
                byStatus: [
                    { $group: { _id: "$status", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } }
                ],
                byRating: [
                    { $bucket: { groupBy: "$rating", boundaries: [0, 1, 2, 3, 4, 5, 6], default: "Unknown", output: { count: { $sum: 1 } } } },
                    { $sort: { _id: -1 } },
                    { $project: { _id: 0, rating: "$_id", count: 1 } }
                ],
                byMonth: [
                    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
                    { $sort: { _id: -1 } }
                ],
                byCreator: [
                    { $group: { _id: "$createdBy", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]
            }
        }
    ])
    result.totalCompanies = totalCompanies
    result.stats = stats[0]
    return result
}