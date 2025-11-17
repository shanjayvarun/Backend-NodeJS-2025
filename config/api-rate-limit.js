const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // limit each IP to 3 requests per 15 minutes
    message: {
        status: false,
        code: 429,
        message: "Too many login attempts. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

const registerLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: {
        status: false,
        code: 429,
        message: "Too many account creations. Please try again after 30 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

module.exports = { loginLimiter, registerLimiter }