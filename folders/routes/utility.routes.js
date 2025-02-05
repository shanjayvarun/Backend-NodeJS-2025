const express = require('express');
const utilityController = require('../controllers/utility.controller');
const upload = require('../../config/upload-image.config');
const { validateToken } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/upload-image", validateToken, upload.single('file'), utilityController.uploadImage);

module.exports = router;