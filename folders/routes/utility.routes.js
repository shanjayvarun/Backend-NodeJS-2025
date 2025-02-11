const express = require('express');
const utilityController = require('../controllers/utility.controller');
const upload = require('../../config/upload-image.config');

const router = express.Router();

router.post("/upload-image", upload.single('file'), utilityController.uploadImage);

module.exports = router;