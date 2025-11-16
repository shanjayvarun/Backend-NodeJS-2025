const upload = require('../../config/upload-file.config');
const { sendSuccessUpdateOrDelete, sendError, sendSuccessGet } = require('../utility/responses');
const { s3, s3params, listS3Files } = require("../utility/s3");
const { getCountries } = require("../utility/utility");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();
const weatherService = require('../services/weather.service');
const mongoose = require('mongoose');

exports.uploadFile = (req, res) => {
    upload.single('file')(req, res, (error) => {
        return error ? sendError(res, 400, error.message) : sendSuccessUpdateOrDelete(res, { url: req.file.location }, 'Image uploaded successfully');
    });
};

exports.getFiles = async (req, res) => {
    try {
        s3params.Prefix = `${req.query.folder}/${req.query.subfolder}`;
        s3params.MaxKeys = req.query.limit || 10;
        const data = await s3.send(listS3Files)
        if (!data.Contents) return sendError(res, 404, 'Files not found');
        const s3ObjectList = data.Contents.map(file => ({ Key: file.Key, Size: file.Size, LastModified: file.LastModified }));
        return sendSuccessGet(res, { s3ObjectList, totalCount: data.Contents.length }, 'Files fetched successfully');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.downloadFile = async (req, res) => {
    try {
        s3params.Prefix = `${req.query.folder}/${req.query.subfolder}/${req.query.id}`;
        const data = await s3.send(listS3Files)
        if (!data.Contents[0].Key) return sendError(res, 404, 'File not found');
        s3params.Key = data.Contents[0].Key
        const command = new GetObjectCommand(s3params);
        const url = await getSignedUrl(s3, command, { expiresIn: 604800 }); // expire time is in 7 Days Now
        return sendSuccessGet(res, { url }, 'File download link generated successfully');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
};

exports.weatherDetails = async (req, res) => {
    try {
        const { data: cityData } = await weatherService.geoCoordinates(req.query.city)
        if (!cityData.length) return sendError(res, 404, "Weather details for this city were not found");
        const { lat, lon, name, country, state } = cityData[0];
        const { data: weather } = await weatherService.currentWeather(lat, lon)
        const response = {
            name,
            country,
            state,
            lat,
            lon,
            temperature: `${weather.main.temp}°C`,
            humidity: `${weather.main.humidity}%`,
            condition: weather.weather[0].description,
            wind_speed: `${weather.wind.speed} m/s`
        };
        return sendSuccessGet(res, response, "Weather details fetched successfully");
    } catch (error) {
        console.error(error.message);
        sendError(res, 500, "Weather API is currently unavailable. Please try again later.");
    }
};

exports.getCountries = async (req, res) => {
    try {
        let { skip, limit } = req.query
        skip = +skip || 0
        limit = +limit || 10
        const countries = await getCountries(skip, limit);
        if (!countries) return sendError(res, 404, 'Countries not found')
        return sendSuccessGet(res, countries, 'Countries fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

exports.getHealth = async (req, res) => {
    try {
        const timestamp = new Date();
        const uptime = process.uptime();
        const dbState = mongoose.connection.readyState === 1;
        let dbPing = "fail";
        let dbLatency = null;
        try {
            const start = Date.now();
            await mongoose.connection.db.admin().ping();
            dbPing = "ok";
            dbLatency = Date.now() - start;
        } catch { }
        const health = {
            status: dbPing === "ok" ? "ok" : "error",
            timestamp,
            uptime,
            app: {
                version: process.env.APP_VERSION || "1.0.0",
                environment: process.env.NODE_ENV || "development",
                memory: process.memoryUsage()
            },
            database: {
                connected: dbState,
                ping: dbPing,
                latencyMs: dbLatency
            },
        };
        return sendSuccessGet(res, health, 'Health Report fetched successfullly')
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}
