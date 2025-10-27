const Leads = require('../models/leads.model');

exports.createLead = async (data) => {
    return await new Leads(data).save()
}

exports.getAllLeads = async (query, sort, skip, limit) => {
    const leads = await Leads.find(query).sort(sort).populate('createdBy', 'name email phoneNumber').skip(skip == -1 ? 0 : skip).limit(limit).lean();
    const count = leads.length
    return { leads, count }
}

exports.getLeadById = async (id) => {
    return await Leads.findById(id).populate('createdBy assignedTo', 'name email role').lean()
}

exports.updateLead = async (id, data) => {
    return await Leads.findByIdAndUpdate(id, data, { new: true });
}

exports.softDeleteLead = async (id) => {
    return await Leads.findByIdAndUpdate(id, { status: 'Lost' }, { new: true });
}

exports.getAllLeadStatus = async () => {
    const leads = await Leads.find().lean();
    const leadsByStatuses = leads.reduce((accumulator, element) => {
        accumulator[element.name] = element.status
        return accumulator
    }, {})
    return leadsByStatuses
}

exports.getLeadStats = async () => {
    const totalLeads = await Leads.countDocuments();
    const stats = await Leads.aggregate([
        {
            $facet: {
                byStatus: [
                    { $group: { _id: "$status", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ],
                bySource: [
                    { $group: { _id: "$source", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ],
                byLocation: [
                    { $group: { _id: "$location", count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ],
                byMonth: [
                    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
                    { $sort: { _id: -1 } },
                    { $project: { _id: 0, month: "$_id", count: 1 } }
                ],
                scoreBuckets: [
                    { $bucket: { groupBy: "$leadsScore", boundaries: [0, 25, 50, 75, 100], output: { count: { $sum: 1 } } } },
                    { $sort: { _id: -1 } }
                ]
            }
        }
    ])
    let result = {};
    result.totalLeads = totalLeads
    result.stats = stats[0];
    return result;
}