const { sendSuccessPost, sendError, sendSuccessGet, sendSuccessUpdateOrDelete } = require("../utility/responses");
const taskService = require("../services/task.service");

exports.createTask = async (req, res) => {
    try {
        const task = await taskService.saveTask(req.body);
        return task ? sendSuccessPost(res, task, 'Task created successfully') : sendError(res, 400, 'Failed to create task');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.getTasks = async (req, res) => {
    try {
        const tasks = req.params.id ? await taskService.getTaskById(req.params.id) : await taskService.getTasks(req.query.page, req.query.limit);
        return tasks ? sendSuccessGet(res, { [req.params.id ? 'task' : 'tasks']: tasks, totalCount: tasks.length }, 'Tasks fetched successfully') : sendError(res, 404, 'No tasks found');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        return task ? sendSuccessUpdateOrDelete(res, 'Task updated successfully') : sendError(res, 404, 'Task not found');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await taskService.deleteTask(req.params.id);
        return task ? sendSuccessUpdateOrDelete(res, 'Task deleted successfully') : sendError(res, 404, 'Task not found');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

