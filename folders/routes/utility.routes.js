const express = require('express');
const utilityController = require('../controllers/utility.controller');

const router = express.Router();

router.post("/upload-file", utilityController.uploadFile);

module.exports = router;