const Leads = require('../models/leads.model');

exports.createLead = async (data) => {
    return await Leads(data).save()
}

exports.getAllLeads = async (query, sort, skip, limit) => {
    const leads = await Leads.find(query).sort(sort).populate('createdBy', 'name email phoneNumber').skip(skip == -1 ? 0 : skip).limit(limit).lean();
    const count = leads.length
    return { leads, count }
}