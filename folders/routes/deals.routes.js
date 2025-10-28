const express = require('express');
const { validateUserToken, validateDeal } = require('../middlewares/validation.middleware');
const { ROLES } = require('../utility/enum');
const { checkRole } = require('../middlewares/roles.middleware');
const dealsController = require('../controllers/deals.controller');

const router = express.Router();

router.post("/create-deal", validateUserToken, checkRole([ROLES.ADMIN]), validateDeal, dealsController.createDeal);
router.get("/get-all-deals", validateUserToken, checkRole([ROLES.ADMIN]), dealsController.getAllDeals);
router.put("/update-deal/:id", validateUserToken, checkRole([ROLES.ADMIN]), dealsController.updateDealStage);
router.put("/soft-delete-deal/:id", validateUserToken, checkRole([ROLES.ADMIN]), dealsController.softDeleteDeal);
router.get("/stats", validateUserToken, checkRole([ROLES.ADMIN]), dealsController.getDealStats);
router.put("/close-deal/:id", validateUserToken, checkRole([ROLES.ADMIN]), dealsController.closeDeal);

module.exports = router;