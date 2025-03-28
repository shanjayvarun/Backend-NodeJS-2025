const Task = require('../models/task.model');

exports.saveTask = async (task) => {
    return await new Task(task).save();
}

exports.getTasks = async (skip, limit) => {
    return await Task.find().skip(skip).limit(limit == -1 ? 0 : limit);
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
