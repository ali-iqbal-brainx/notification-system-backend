const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const { constants, requestStatusEnum } = require("../shared/constants");


const followSchema = new Schema({
    followerId: {
        type: ObjectId,
        require: true,
        ref: "user"
    },
    followingId: {
        type: ObjectId,
        require: true,
        ref: "user"
    },
    status: {
        type: String,
        enum: requestStatusEnum,
        description: "can only be Pending , Approved or Rejected",
        default: constants.REQUEST_STATUS.pending
    }
},
    {
        timestamps: true
    });

const follow = mongoose.model("follow", followSchema);
module.exports = follow;