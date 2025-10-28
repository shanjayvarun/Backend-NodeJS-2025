const Deals = require('../models/deals.model');
const { DEAL_PROBABILITY } = require('../utility/utility');

exports.createDeal = async (data) => {
    data.dealScore = DEAL_PROBABILITY[data.stage] || 0
    return await new Deals(data).save()
}

exports.getAllDeals = async (query, sort, skip, limit) => {
    const deals = await Deals.find(query).sort(sort).skip(skip == -1 ? 0 : skip).limit(limit).populate("company lead assignedTo", "name description email phoneNumber role").lean();
    const count = deals.length
    return { deals, count }
}

exports.updateDeal = async (id, data) => {
    data.dealScore = DEAL_PROBABILITY[data.stage] || 0
    return await Deals.findByIdAndUpdate(id, data, { new: true, overwrite: false })
}

exports.softDeleteDeal = async (id) => {
    return await Deals.findByIdAndUpdate(id, { status: 'lost', closedDate: new Date() }, { new: true, overwrite: false })
}

exports.getDealStats = async () => {
    let result = {}
    result.count = await Deals.countDocuments()
    const stats = await Deals.aggregate([
        {
            $facet: {
                byStages: [
                    { $match: { stage: { $ne: null } } },
                    { $group: { _id: "$stage", totalDeals: { $sum: 1 }, totalDealAmount: { $sum: "$amount" } } },
                    { $sort: { totalDealAmount: -1 } },
                    { $project: { _id: 0, stage: "$_id", totalDeals: 1, totalDealAmount: 1 } }
                ],
                byMonth: [
                    { $match: { createdAt: { $ne: null } } },
                    { $group: { _id: { $month: "$createdAt" }, totalDeals: { $sum: 1 }, totalDealAmountByMonth: { $sum: "$amount" } } },
                    { $sort: { _id: -1 } },
                ],
                byStatus: [
                    { $match: { status: { $ne: null } } },
                    { $group: { _id: "$status", count: { $sum: 1 } } },
                    { $sort: { _id: -1 } }
                ]
            }
        }
    ])
    result.stats = stats[0]
    return result
}