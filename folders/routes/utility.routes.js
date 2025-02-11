const express = require('express');
const utilityController = require('../controllers/utility.controller');
const upload = require('../../config/upload-file.config');

const router = express.Router();

router.post("/upload-file", upload.single('file'), utilityController.uploadFile);

module.exports = router;