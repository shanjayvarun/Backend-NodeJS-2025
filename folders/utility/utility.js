const bcrypt = require('bcrypt');
const { sendError } = require('./responses');

const hashPassword = async (password) => {
    try {
        const saltRounds = process.env.NODE_ENV == 'development' ? 10 : 12
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        return sendError(error, 500, "Error hashing password");
    }
};

module.exports = { hashPassword }