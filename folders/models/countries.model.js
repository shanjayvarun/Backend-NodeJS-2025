const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('countries', countrySchema);