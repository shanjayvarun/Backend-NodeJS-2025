const express = require('express');
const { validateUserToken } = require('../middlewares/validation.middleware');
const { ROLES } = require('../utility/enum');
const { checkRole } = require('../middlewares/roles.middleware');
const leadsController = require('../controllers/leads.controller');

const router = express.Router();

router.post("/create-lead", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.createLead);
// router.get("/get-all-leads", validateUserToken, checkRole([ROLES.ADMIN]));
// router.get("/get-lead-by-id/:id", validateUserToken, checkRole([ROLES.ADMIN]));
// router.put("/update-lead/:id", validateUserToken, checkRole([ROLES.ADMIN]));
// router.put("/soft-delete-lead/:id", validateUserToken, checkRole([ROLES.ADMIN]));
// router.put("/update-status/:id", validateUserToken, checkRole([ROLES.ADMIN]));
// router.put("/assign-lead/:id", validateUserToken, checkRole([ROLES.ADMIN]));
// router.put("/convert-lead/:id", validateUserToken, checkRole([ROLES.ADMIN]));
// router.get("/get-lead-statuses", validateUserToken, checkRole([ROLES.ADMIN]));
// router.get("/get-lead-tags", validateUserToken, checkRole([ROLES.ADMIN]));
// router.post("/calculate-lead-score", validateUserToken, checkRole([ROLES.ADMIN]));

module.exports = router; 