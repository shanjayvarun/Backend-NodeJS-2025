const express = require('express');
const { validateUserToken, validateLead } = require('../middlewares/validation.middleware');
const { ROLES } = require('../utility/enum');
const { checkRole } = require('../middlewares/roles.middleware');
const leadsController = require('../controllers/leads.controller');

const router = express.Router();

router.post("/create-lead", validateUserToken, checkRole([ROLES.ADMIN]), validateLead, leadsController.createLead);
router.get("/get-all-leads", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.getAllLeads);
router.get("/get-lead-by-id/:id", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.getLeadById);
router.put("/update-lead/:id", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.updateLead);
router.put("/soft-delete-lead/:id", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.softDeleteLead);
router.get("/get-lead-statuses", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.getLeadStatuses);
router.get("/get-lead-tags", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.getLeadTags);
router.post("/create-lead-tag", validateUserToken, checkRole([ROLES.ADMIN]), leadsController.createLeadTag);

module.exports = router; 