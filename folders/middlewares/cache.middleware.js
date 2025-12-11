const redis = require('../../config/redis');
const { sendError } = require('../utility/responses');

module.exports = function cache(prefix) {
    return async (req, res, next) => {
        try {
            const queryKey = JSON.stringify(req.query);
            const key = `${prefix}:${queryKey}`;
            const cached = await redis.get(key);
            if (cached) {
                logger.info("CACHE HIT:", key);
                return res.status(200).json(JSON.parse(cached));
            }
            logger.info("CACHE MISS:", key);
            res.sendResponse = res.json;
            res.json = async (body) => {
                await redis.set(key, JSON.stringify(body), "EX", 30);
                res.sendResponse(body);
            };
            next();
        } catch (err) {
            sendError(err, 500, err);
            next();
        }
    };
};
