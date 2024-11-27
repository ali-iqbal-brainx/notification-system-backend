const post = require("../models/post");


const addPost = async (data) => {
    return new Promise((resolve, reject) => {
        new post(data)
            .save()
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });

}

const findPost = async (condition) => {
    return new Promise((resolve, reject) => {
        post.findOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const updatePost = async (condition, update, option) => {
    return new Promise((resolve, reject) => {
        post.findOneAndUpdate(condition, update, option)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

const postAggregate = async (query) => {
    return new Promise((resolve, reject) => {
        post.aggregate(query)
            .then((result) => resolve(result))
            .catch((err) => reject(err));
    });

}

const deletePost = async (condition) => {
    return new Promise((resolve, reject) => {
        post.deleteOne(condition)
            .then((user) => resolve(user))
            .catch((err) => reject(err));
    });

}

module.exports = {
    addPost,
    findPost,
    updatePost,
    postAggregate,
    deletePost
}