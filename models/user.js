const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { constants } = require("../shared/constants");
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: { createdAt: true, updatedAt: true },
    });

userSchema.pre('save', async function (next) {
    try {
        if (this.password) {
            if (!constants.PASSWORD_REGEX.test(this.password)) {
                next(
                    'Password must contain at least 8 characters, 1 uppercase letter and 1 special character!'
                );
            }
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const user = mongoose.model('user', userSchema);
module.exports = user;
