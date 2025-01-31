const Task = require('../models/task.model');

exports.saveTask = async (task) => {
    const tasks = new Task(task);
    return await tasks.save();
}

exports.getTasks = async () => {
    const tasks = await Task.find();
    return tasks;
}

exports.getTaskById = async (id) => {
    const task = await Task.findById(id)
    return task;
}
