const Task = require('../models/task.model');

exports.saveTask = async (task) => {
    const tasks = new Task(task);
    return await tasks.save();
}

exports.getTasks = async () => {
    return await Task.find();
}

exports.getTaskById = async (id) => {
    return await Task.findById(id)
}

exports.updateTask = async (id, task) => {
    return await Task.findByIdAndUpdate(id, task, { new: true });
}

exports.deleteTask = async (id) => {
    return await Task.findByIdAndDelete(id);
}
