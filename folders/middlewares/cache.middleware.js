const redis = require('../../config/redis');

module.exports = function cache(prefix) {
    return async (req, res, next) => {
        try {
            const queryKey = JSON.stringify(req.query);
            const key = `${prefix}:${queryKey}`;
            const cached = await redis.get(key);
            if (cached) {
                console.log("CACHE HIT:", key);
                return res.status(200).json(JSON.parse(cached));
            }
            console.log("CACHE MISS:", key);
            res.sendResponse = res.json;
            res.json = async (body) => {
                await redis.set(key, JSON.stringify(body), "EX", 30);
                res.sendResponse(body);
            };
            next();
        } catch (err) {
            console.error("Cache Error:", err);
            next();
        }
    };
};
