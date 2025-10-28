const dealService = require('../services/deals.service');
const { sendSuccessPost, sendSuccessGet, sendError, sendSuccessUpdateOrDelete } = require('../utility/responses');

exports.createDeal = async (req, res) => {
    try {
        req.body.createdBy = req.user.id
        const deal = await dealService.createDeal(req.body);
        // req.body.dealScore = await calculateDealScore(req.body)
        if (!deal) return sendError(res, 404, 'Deal creation failed')
        return sendSuccessPost(res, deal, 'Deal created successfully')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.getAllDeals = async (req, res) => {
    try {
        let { amountFrom, amountTo, stage, status, title, sortBy, sortOrder, skip, limit, fromDate, toDate } = req.query
        let query = {};
        let sort = {};
        skip = +skip || 0
        limit = +limit || 10
        amountFrom = +amountFrom || 0;
        amountTo = +amountTo || Number.MAX_SAFE_INTEGER;
        if (stage) query.stage = stage;
        if (status) query.status = status;
        if (title) { query.title = { $regex: title, $options: 'i' } }
        if (amountFrom && amountTo) {
            if (amountFrom > amountTo) return sendError(res, 400, 'Amount should be in ascending range')
            query.amount = {};
            query.amount.$gte = amountFrom
            query.amount.$lte = amountTo
        }
        if (fromDate && toDate) {
            if (fromDate > toDate) return sendError(res, 400, 'fromDate cannot be greater than toDate');
            query.createdAt = {};
            query.createdAt.$gte = fromDate
            query.createdAt.$lte = toDate
        }
        sort[sortBy] = (sortOrder == 'desc') ? -1 : 1
        const deals = await dealService.getAllDeals(query, sort, skip, limit);
        if (!deals) return sendError(res, 404, "No Deals Found");
        return sendSuccessGet(res, deals, 'Deals fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.updateDealStage = async (req, res) => {
    try {
        const deal = await dealService.updateDeal(req.params.id, req.body);
        if (!deal) return sendError(res, 404, 'Deal not found');
        return sendSuccessUpdateOrDelete(res, 'Deal stage updated successfully');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.softDeleteDeal = async (req, res) => {
    try {
        const deal = await dealService.softDeleteDeal(req.params.id);
        if (!deal) return sendError(res, 404, 'Deal not found');
        return sendSuccessUpdateOrDelete(res, 'Deal stage deleted successfully');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

exports.getDealStats = async (req, res) => {
    try {
        const stats = await dealService.getDealStats();
        if (!stats) return sendError(res, 404, 'No deal statistics found');
        return sendSuccessGet(res, stats, 'Deal statistics fetched successfully');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.closeDeal = async (req, res) => {
    try {
        const { rating, dealScore } = req.body;
        const deal = await dealService.updateDeal(req.params.id, {
            status: 'won',
            closedDate: new Date(),
            rating,
            dealScore
        });
        if (!deal) return sendError(res, 404, 'Deal not found');
        return sendSuccessUpdateOrDelete(res, 'Deal closed successfully');
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};