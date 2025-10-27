const express = require('express');
const { validateUserToken, validateCompany } = require('../middlewares/validation.middleware');
const { ROLES } = require('../utility/enum');
const { checkRole } = require('../middlewares/roles.middleware');
const companiesController = require('../controllers/companies.controller');

const router = express.Router();

router.post("/create-company", validateUserToken, checkRole([ROLES.ADMIN]), validateCompany, companiesController.createCompany);
router.get("/get-all-companies", validateUserToken, checkRole([ROLES.ADMIN]), companiesController.getAllCompanies);
router.get("/get-company-by-id/:id", validateUserToken, checkRole([ROLES.ADMIN]), companiesController.getCompanyById);
router.put("/update-company/:id", validateUserToken, checkRole([ROLES.ADMIN]), companiesController.updateCompany);
router.put("/soft-delete-company/:id", validateUserToken, checkRole([ROLES.ADMIN]), companiesController.softDeleteCompany);
router.get("/stats", validateUserToken, checkRole([ROLES.ADMIN]), companiesController.getCompanyStats)

module.exports = router;