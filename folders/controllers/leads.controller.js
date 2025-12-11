const leadService = require('../services/leads.service');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessUpdateOrDelete } = require('../utility/responses');
const companyService = require('../services/companies.service');
const tagService = require('../services/tags.service');
const { calculateLeadScore } = require('../utility/utility');

exports.createLead = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        req.body.leadsScore = await calculateLeadScore(req.body)
        const lead = await leadService.createLead(req.body)
        if (!lead) return sendError(res, 404, 'Lead creation failed')
        return sendSuccessPost(res, lead, 'Lead created successfully')
    } catch (error) {
        if (error.code == 11000) {
            return sendError(res, 409, 'Lead already exists');
        }
        return sendError(res, 500, error.message);
    }
};

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
        // return sendSuccessGet(res, leads, 'Leads fetched successfullly')
        return res.json({
            status: true,
            message: 'Leads fetched successfully',
            data: leads
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.getLeadById = async (req, res) => {
    try {
        const lead = await leadService.getLeadById(req.params.id)
        if (!lead) return sendError(res, 404, 'Lead not found')
        return sendSuccessGet(res, lead, 'Lead fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.updateLead = async (req, res) => {
    try {
        if (req.body.status == 'Converted') {
            const lead = await leadService.getLeadById(req.params.id);
            if (!lead) return sendError(res, 404, 'Lead not found');
            const updatedLeadData = { ...lead, ...req.body };
            updatedLeadData.leadsScore = await calculateLeadScore(updatedLeadData);
            await leadService.updateLead(req.params.id, updatedLeadData);
            delete lead.leadsScore;
            delete lead.source;
            delete lead.assignedTo;
            delete lead.isExempted;
            lead.totalEmployees = req.body.totalEmployees || '500-1000'
            lead.rating = req.body.rating || 5
            lead.DOI = req.body.DOI || Date.now()
            lead.status = 'active'
            lead.createdBy = req.user.id
            await companyService.createCompany(lead);
            return sendSuccessUpdateOrDelete(res, 'Lead converted to client successfully.');
        }
        const leadById = await leadService.getLeadById(req.params.id);
        if (!leadById) return sendError(res, 404, 'Lead not found');
        const updatedLeadData = { ...leadById, ...req.body };
        updatedLeadData.leadsScore = await calculateLeadScore(updatedLeadData);
        await leadService.updateLead(req.params.id, updatedLeadData);
        return sendSuccessUpdateOrDelete(res, 'Lead updated successfullly');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.softDeleteLead = async (req, res) => {
    try {
        const lead = await leadService.softDeleteLead(req.params.id)
        if (!lead) return sendError(res, 404, 'Lead not found')
        return sendSuccessUpdateOrDelete(res, 'Lead deleted successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.getLeadStatuses = async (req, res) => {
    try {
        const leadStatuses = await leadService.getAllLeadStatus()
        if (!leadStatuses) return sendError(res, 404, 'Leads not found')
        return sendSuccessGet(res, leadStatuses, 'Lead Statuses fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.getLeadTags = async (req, res) => {
    try {
        let { skip, limit } = req.query
        skip = +skip || 0
        limit = +limit || 20
        const tags = await tagService.getTags(skip, limit)
        if (!tags) return sendError(res, 404, 'Tags not found')
        return sendSuccessGet(res, tags, 'Tags fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.createLeadTag = async (req, res) => {
    try {
        const tag = await tagService.createTag(req.body)
        if (!tag) return sendError(res, 404, 'Tag creation failed')
        return sendSuccessPost(res, tag, 'Tag created successfully')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.getLeadStats = async (req, res) => {
    try {
        const stats = await leadService.getLeadStats();
        if (!stats) return sendError(res, 404, 'No lead statistics found');
        return sendSuccessGet(res, stats, 'Lead statistics fetched successfully');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}
