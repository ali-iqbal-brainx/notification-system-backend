const like = require("../models/like");

const addLike = async (data) => {
    return new Promise((resolve, reject) => {
        new like(data)
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });

}

const findLike = async (condition) => {
    return new Promise((resolve, reject) => {
        like.findOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const findLikes = async (condition) => {
    return new Promise((resolve, reject) => {
        like.find(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const likeAggregate = async (query) => {
    return new Promise((resolve, reject) => {
        like.aggregate(query)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });

}

const deleteLike = async (condition) => {
    return new Promise((resolve, reject) => {
        like.deleteOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const deleteLikes = async (condition) => {
    return new Promise((resolve, reject) => {
        like.deleteMany(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

module.exports = {
    addLike,
    findLike,
    findLikes,
    likeAggregate,
    deleteLike,
    deleteLikes
}