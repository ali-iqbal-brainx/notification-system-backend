const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        require: true,
        ref: "user"
    }
},
    {
        timestamps: { createdAt: true, updatedAt: true },
    });

const post = mongoose.model("post", postSchema);
module.exports = post;