const express = require('express');
const taskController = require('../controllers/task.controller');
const { validateTaskCreation } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post("/create-task", validateTaskCreation, taskController.createTask);
router.get("/get-tasks", taskController.getTasks);
router.get("/get-task/:id", taskController.getTasks);
router.put("/update-task/:id", taskController.updateTask);
router.delete("/delete-task/:id", taskController.deleteTask);

module.exports = router;