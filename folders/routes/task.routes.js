const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.post("/create-task", taskController.createTask);
router.get("/get-tasks", taskController.getTasks);
router.get("/get-task/:id", taskController.getTasks);

module.exports = router;