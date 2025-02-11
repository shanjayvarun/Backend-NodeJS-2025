const express = require('express');
const utilityController = require('../controllers/utility.controller');
const uploadFile = require('../../config/upload-file.config');

const router = express.Router();

router.post("/upload-file", uploadFile, utilityController.uploadFile);

module.exports = router;