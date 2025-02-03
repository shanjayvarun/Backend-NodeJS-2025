const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendError } = require('./responses');

const hashPassword = async (password) => {
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password", error);
    }
};

const validateToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return sendError(res, res.status(401), 'No token provided. Unauthorized');
    }
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return sendError(res, res.status(403), 'Failed to authenticate token');
        }
        req.user = decoded;
        next();
    });
};

module.exports = { hashPassword, validateToken }