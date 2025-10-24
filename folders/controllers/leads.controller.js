const leadService = require('../services/leads.service');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessUpdateOrDelete } = require('../utility/responses');

exports.createLead = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        const lead = await leadService.createLead(req.body)
        if (!lead) return sendError(res, 404, 'Lead creation failed')
        return sendSuccessPost(res, lead, 'Lead created successfully')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
} 