const follow = require("../models/follow");


const addFollow = async (data) => {
    return new Promise((resolve, reject) => {
        new follow(data)
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });

}

const findFollow = async (condition) => {
    return new Promise((resolve, reject) => {
        follow.findOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const findFollows = async (condition) => {
    return new Promise((resolve, reject) => {
        follow.find(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updateFollow = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        follow.findOneAndUpdate(condition, update, option)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updateFollows = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        follow.updateMany(condition, update, option)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const followAggregate = async (query) => {
    return new Promise((resolve, reject) => {
        follow.aggregate(query)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });

}

const deleteFollow = async (condition) => {
    return new Promise((resolve, reject) => {
        follow.deleteOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const deleteFollows = async (condition) => {
    return new Promise((resolve, reject) => {
        follow.deleteMany(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

module.exports = {
    findFollow,
    findFollows,
    updateFollow,
    addFollow,
    updateFollows,
    followAggregate,
    deleteFollow,
    deleteFollows
}