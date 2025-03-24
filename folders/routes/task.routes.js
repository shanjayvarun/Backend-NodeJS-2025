const express = require('express');
const taskController = require('../controllers/task.controller');
const { validateTaskCreation, validateUserToken } = require('../middlewares/validation.middleware');
const { checkRole } = require('../middlewares/roles.middleware');
const { ROLES } = require('../utility/enum');

const router = express.Router();

router.post("/create-task", validateUserToken, validateTaskCreation, checkRole([ROLES.ADMIN, ROLES.USER]), taskController.createTask);
router.get("/get-tasks", validateUserToken, taskController.getTasks);
router.get("/get-task/:id", validateUserToken, taskController.getTasks);
router.patch("/update-task/:id", validateUserToken, taskController.updateTask);
router.delete("/delete-task/:id", validateUserToken, taskController.deleteTask);

module.exports = router;