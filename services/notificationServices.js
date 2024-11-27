const notification = require("../models/notification");


const addNotification = async (data) => {
    return new Promise((resolve, reject) => {
        new notification(data)
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });

}

const findNotification = async (condition) => {
    return new Promise((resolve, reject) => {
        notification.findOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const findNotifications = async (condition) => {
    return new Promise((resolve, reject) => {
        notification.find(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updateNotification = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        notification.findOneAndUpdate(condition, update, option)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updateNotifications = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        notification.updateMany(condition, update, option)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const notificationAggregate = async (query) => {
    return new Promise((resolve, reject) => {
        notification.aggregate(query)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });

}

const deleteNotification = async (condition) => {
    return new Promise((resolve, reject) => {
        notification.deleteOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const deleteNotifications = async (condition) => {
    return new Promise((resolve, reject) => {
        notification.deleteMany(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

module.exports = {
    addNotification,
    findNotification,
    findNotifications,
    updateNotification,
    updateNotifications,
    notificationAggregate,
    deleteNotification,
    deleteNotifications
}