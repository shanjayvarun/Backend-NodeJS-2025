const companyService = require('../services/companies.service');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessNoContent, sendSuccessUpdateOrDelete } = require('../utility/responses');

exports.createCompany = async (req, res) => {
    try {
        const company = await companyService.createCompany(req.body)
        if (!company) return sendError(res, 404, 'Company creation failed')
        return sendSuccessPost(res, company, 'Company created successfully')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.getAllCompanies = async (req, res) => {
    try {
        let { status, searchBy, skip, limit, fromDate, toDate } = req.query
        skip = +skip || 0
        limit = +limit || 0
        let query = {};
        if (status) { query.status = status }
        if (searchBy) { query.name = searchBy }
        if (fromDate && toDate) {
            if (fromDate > toDate) return sendError(res, 400, 'fromDate cannot be greater than toDate');
            query.createdAt = {};
            query.createdAt.$gte = fromDate
            query.createdAt.$lte = toDate
        }
        const company = await companyService.getAllCompanies(query, skip, limit);
        if (!company) return sendError(res, 404, 'Companies not found')
        return sendSuccessGet(res, company, 'Companies fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.getCompanyById = async (req, res) => {
    try {
        const company = await companyService.getCompanyById(req.params.id)
        if (!company) return sendError(res, 404, 'Company not found')
        return sendSuccessGet(res, company, 'Company fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const company = await companyService.updateCompany(req.params.id, req.body)
        if (!company) return sendError(res, 404, 'Company not found')
        return sendSuccessGet(res, company, 'Company updated successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const company = await companyService.deleteCompany(req.params.id)
        if (!company) return sendError(res, 404, 'Company not found')
        return sendSuccessGet(res, company, 'Company deleted successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

