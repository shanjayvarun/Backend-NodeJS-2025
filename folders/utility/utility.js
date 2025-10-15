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

const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("Error comparing password: " + error.message);
    }
};

module.exports = { hashPassword, comparePassword }