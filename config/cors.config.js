const { allowedCORSDomains } = require("../folders/utility/enum");

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedCORSDomains.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("CORS not allowed for this origin"));
        }
    },
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
    maxAge: 600,
};

module.exports = corsOptions;
