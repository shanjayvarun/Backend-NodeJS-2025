const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

router.post("/create-task", taskController.createTask);

module.exports = router;