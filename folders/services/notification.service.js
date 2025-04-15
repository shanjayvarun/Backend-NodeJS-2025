const Notification = require('../models/notification.model');

exports.createNotification = async (data) => {
    return await new Notification(data).save()
}

exports.getNotificationsByUserId = async (userId) => {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean()
}

exports.markAsReadById = async (id) => {
    return await Notification.findByIdAndUpdate(id, { isRead: true });
}

exports.markAllAsReadByUserId = async (userId) => {
    return await Notification.updateMany({ user: userId, isRead: false }, { isRead: true })
}

exports.deleteNotificationById = async (id) => {
    return await Notification.findByIdAndDelete(id)
}

exports.deleteNotificationsByUserId = async (userId) => {
    return await Notification.deleteMany({ user: userId })
}
