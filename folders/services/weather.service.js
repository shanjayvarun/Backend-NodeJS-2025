require('dotenv').config();
const axios = require("axios");
const environment = require('../../config/env.config')

exports.geoCoordinates = async (city) => {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${environment.openWeather}`;
    return await axios.get(geoUrl);
};

exports.currentWeather = async (latitude, longitude) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${environment.openWeather}&units=metric`;
    return await axios.get(weatherUrl)
};