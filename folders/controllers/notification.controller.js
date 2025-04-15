const { sendSuccessPost, sendError, sendSuccessGet, sendSuccessUpdateOrDelete, sendSuccessNoContent } = require("../utility/responses");
const notificationService = require("../services/notification.service");

exports.createNotification = async (req, res) => {
    try {
        const notification = await notificationService.createNotification(req.body);
        return notification ? sendSuccessPost(res, notification, "Notification created successfully") : sendError(res, 404, "Creating notification failed")
    } catch (error) {
        return sendError(error, 500, error.message)
    }
}

exports.getNotifications = async (req, res) => {
    try {
        const notification = await notificationService.getNotificationsByUserId(req.query.userId);
        return notification ? sendSuccessGet(res, notification, 'Notifications fetched successfully') : sendError(res, 404, 'No notifications found for this user')
    } catch (error) {
        return sendError(error, 500, error.message)
    }
}

exports.markNotificationsRead = async (req, res) => {
    try {
        const notification = req.query.id ? await notificationService.markAsReadById(req.query.id) : await notificationService.markAllAsReadByUserId(req.query.userId);
        return notification ? sendSuccessNoContent(res) : sendError(res, 404, `No notifications found ${req.query.id ? '' : 'for this user'}`)
    } catch (error) {
        return sendError(error, 500, error.message)
    }
}

exports.deleteNotifications = async (req, res) => {
    try {
        const notification = req.query.id ? await notificationService.deleteNotificationById(req.query.id) : await notificationService.deleteNotificationsByUserId(req.query.userId);
        return notification ? sendSuccessNoContent(res) : sendError(res, 404, `No notifications found ${req.query.id ? '' : 'for this user'}`)
    } catch (error) {
        return sendError(error, 500, error.message)
    }
}