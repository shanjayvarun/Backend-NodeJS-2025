const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { validateUserToken } = require('../middlewares/validation.middleware');
const { checkRole } = require('../middlewares/roles.middleware');
const { ROLES } = require('../utility/enum');

const router = express.Router();

router.post("/create-notifications", validateUserToken, checkRole([ROLES.ADMIN, ROLES.USER]), notificationController.createNotification);
router.get("/get-notifications", validateUserToken, notificationController.getNotifications);
router.patch("/mark-notifications-read", validateUserToken, notificationController.markNotificationsRead);
router.delete("/delete-notifications", validateUserToken, notificationController.deleteNotifications);

module.exports = router;