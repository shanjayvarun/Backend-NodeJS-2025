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