const express = require('express');
const utilityController = require('../controllers/utility.controller');
const { validateUserToken, validateCity } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/upload-file", validateUserToken, utilityController.uploadFile);
router.get("/get-files", validateUserToken, utilityController.getFiles);
router.get("/download-file", validateUserToken, utilityController.downloadFile);
router.get("/weather", validateUserToken, validateCity, utilityController.weatherDetails);
router.get("/countries", validateUserToken, utilityController.getCountries)
router.get("/health", utilityController.getHealth)

module.exports = router;