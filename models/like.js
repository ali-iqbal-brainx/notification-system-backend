const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const likeSchema = new Schema({
    postId: {
        type: ObjectId,
        ref: "post",
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    });

const like = mongoose.model("like", likeSchema);
module.exports = like;