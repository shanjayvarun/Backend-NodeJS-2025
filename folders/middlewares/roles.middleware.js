const { sendError } = require("../utility/responses")

const checkRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role
        roles.includes(userRole) ? next() : sendError(res, 403, 'Access denied. You do not have the required role.')
    }
}

module.exports = { checkRole }