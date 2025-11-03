const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const environment = {
    mode: env,
    port: process.env.PORT || 5000,
    version: process.env.VERSION,
    subdomain: process.env.SUBDOMAIN,
    mongoUri: process.env.MONGO_URI,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        algorithm: process.env.JWT_ALGO
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME
    },
    openWeather: {
        key: process.env.OPEN_WEATHER_MAP_KEY
    },
    cloudwatch: {
        group: process.env.CLOUDWATCH_GROUP,
        stream: process.env.CLOUDWATCH_STREAM
    },
    debug: process.env.DEBUG === 'true'
};

module.exports = environment;
