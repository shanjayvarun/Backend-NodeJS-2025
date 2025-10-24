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

exports.getAllLeads = async (req, res) => {
    try {
        let { name, location, fromDate, toDate, status, leadScoreFrom, leadScoreTo, tags, sortBy, sortOrder, skip, limit } = req.query
        skip = +skip || 0
        limit = +limit || 10
        let query = {};
        let sort = {};
        if (name) { query.name = { $regex: name, $options: 'i' } }
        if (location) query.location = location
        if (fromDate && toDate) {
            if (fromDate > toDate) return sendError(res, 400, 'fromDate cannot be greater than toDate');
            query.createdAt = {}
            query.createdAt.$gte = fromDate
            query.createdAt.$lte = toDate
        }
        if (leadScoreFrom && leadScoreTo) {
            if (leadScoreFrom > leadScoreTo) return sendError(res, 400, 'Lead score should be in ascending range');
            query.leadsScore = {}
            query.leadsScore.$gte = leadScoreFrom
            query.leadsScore.$lte = leadScoreTo
        }
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
            query.tags = { $in: tagArray };
        }
        if (status) {
            const statusArray = Array.isArray(status) ? status : status.split(',').map(t => t.trim())
            query.status = { $in: statusArray }
        }
        if (sortBy) sort[sortBy] = (sortOrder == 'desc') ? -1 : 1
        const leads = await leadService.getAllLeads(query, sort, skip, limit);
        if (!leads) return sendError(res, 404, 'Leads not found')
        return sendSuccessGet(res, leads, 'Leads fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}
