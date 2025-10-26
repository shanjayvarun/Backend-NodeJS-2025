const bcrypt = require('bcrypt');
const { sendError } = require('./responses');
const Country = require('../models/countries.model')

const hashPassword = async (password) => {
    try {
        const saltRounds = process.env.NODE_ENV == 'development' ? 10 : 12
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        return sendError(error, 500, "Error hashing password");
    }
};

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Error comparing password: " + error.message);
    }
};

const getCountries = async (skip, limit) => {
    const countries = await Country.find().skip(skip == -1 ? 0 : skip).limit(limit).lean();
    return countries;
}

const calculateLeadScore = async (lead) => {
    let score = 0;
    switch (lead.source) {
        case 'Website':
            score += 25;
            break;
        case 'Referral':
            score += 20;
            break;
        case 'LinkedIn':
            score += 15;
            break;
        case 'Event':
            score += 10;
            break;
        default:
            score += 5;
    }
    switch (lead.status) {
        case 'New':
            score += 5;
            break;
        case 'Contacted':
            score += 15;
            break;
        case 'Qualified':
            score += 25;
            break;
        case 'Converted':
            score += 50;
            break;
        case 'Lost':
            score += 0;
            break;
        case 'Follow-Up':
            score += 20;
            break;
    }
    if (lead.tags && lead.tags.length > 0) {
        score += Math.min(lead.tags.length * 3, 15);
    }
    const daysOld = (Date.now() - (lead.createdAt ? new Date(lead.createdAt) : Date.now())) / (1000 * 60 * 60 * 24);
    if (daysOld <= 7) score += 25;
    else if (daysOld <= 30) score += 15;
    else if (daysOld <= 90) score += 5;
    else score += 0;
    score = Math.max(0, Math.min(score, 100));
    return score
}

module.exports = { hashPassword, comparePassword, getCountries, calculateLeadScore }