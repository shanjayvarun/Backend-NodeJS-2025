const express = require('express');
const utilityController = require('../controllers/utility.controller');

const router = express.Router();

router.post("/upload-file", utilityController.uploadFile);
router.get("/get-files", utilityController.getFiles);

module.exports = router;