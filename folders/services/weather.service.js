require('dotenv').config();
const axios = require("axios");

exports.geoCoordinates = async (city) => {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPEN_WEATHER_MAP_KEY}`;
    return await axios.get(geoUrl);
};

exports.currentWeather = async (latitude, longitude) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`;
    return await axios.get(weatherUrl)
};