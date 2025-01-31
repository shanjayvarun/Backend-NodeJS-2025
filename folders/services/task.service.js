const Task = require('../models/task.model');

exports.saveTask = async (task) => {
    const tasks = new Task(task);
    return await tasks.save();
}
