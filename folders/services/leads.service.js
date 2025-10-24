const Leads = require('../models/leads.model');

exports.createLead = async (data) => {
    return await Leads(data).save()
} 