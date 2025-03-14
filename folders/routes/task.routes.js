const express = require('express');
const taskController = require('../controllers/task.controller');
const { validateTaskCreation, validateToken } = require('../middlewares/validation.middleware');
const { checkRole } = require('../middlewares/roles.middleware');

const router = express.Router();

router.post("/create-task", validateToken, validateTaskCreation, checkRole([ROLES.ADMIN, ROLES.USER]), taskController.createTask);
router.get("/get-tasks", validateToken, taskController.getTasks);
router.get("/get-task/:id", validateToken, taskController.getTasks);
router.patch("/update-task/:id", validateToken, taskController.updateTask);
router.delete("/delete-task/:id", validateToken, taskController.deleteTask);

module.exports = router;