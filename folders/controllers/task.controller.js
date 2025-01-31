const { sendSuccessPost, sendError } = require("../middlewares/response.middleware");
const taskService = require("../services/task.service");

exports.createTask = async (req, res) => {
    try {
        const task = await taskService.saveTask(req.body);
        return task ? sendSuccessPost(res, task, 'Task created successfully') : sendError(res, 400, 'Failed to create task');
    } catch (error) {
        sendError(res, 500, error.message);
    }
}