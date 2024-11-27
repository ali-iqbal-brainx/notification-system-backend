const user = require("../models/user");


const addUser = async (data) => {
    return new Promise((resolve, reject) => {
        new user(data)
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });

}

const findUser = async (condition) => {
    return new Promise((resolve, reject) => {
        user.findOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updateUser = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        user.findOneAndUpdate(condition, update, option)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const getUsers = async (condition, filter) => {
    return new Promise((resolve, reject) => {
        user.aggregate([condition, filter])
            .then((users) => resolve(users))
            .catch((err) => reject(err));
    });

}

const userAggregate = async (query) => {
    return new Promise((resolve, reject) => {
        user.aggregate(query)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });

}

const deleteUser = async (condition) => {
    return new Promise((resolve, reject) => {
        user.deleteOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updateUsers = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        user.updateMany(condition, update, option)
            .then((user) => resolve(user.modifiedCount))
            .catch((err) => reject(err));
    });

}

module.exports = {
    addUser,
    findUser,
    updateUser,
    getUsers,
    userAggregate,
    deleteUser,
    updateUsers
}