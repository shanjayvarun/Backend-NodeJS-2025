const { sendSuccessPost, sendError, sendSuccessGet } = require("../middlewares/response.middleware");
const taskService = require("../services/task.service"); 

exports.createTask = async (req, res) => {
    try {
        const task = await taskService.saveTask(req.body);
        return task ? sendSuccessPost(res, task, 'Task created successfully') : sendError(res, res.status(400), 'Failed to create task');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

exports.getTasks = async (req, res) => {
    try {
        const tasks = req.params.id ? await taskService.getTaskById(req.params.id) : await taskService.getTasks();
        return tasks ? sendSuccessGet(res, { [req.params.id ? 'task' : 'tasks']: tasks }, 'Tasks fetched successfully') : sendError(res, res.status(404), 'No tasks found');
    } catch (error) {
        return sendError(error, 500, error.message);
    }
}

