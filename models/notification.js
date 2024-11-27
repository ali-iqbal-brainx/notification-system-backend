const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const { notificationTypeEnum } = require("../shared/constants");

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: notificationTypeEnum,
        required: true
    },
    relatedRequestId: {
        type: Types.ObjectId,
        refPath: 'relatedModel',
        required: true
    },
    relatedModel: {
        type: String,
        enum: ["like", "follow"],
        required: true
    },
    userId: {
        type: Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;
