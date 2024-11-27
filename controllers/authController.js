const userServices = require('../services/userServices');
const jwtServices = require('../services/jwtServices');
const bcrypt = require('bcryptjs');
const _ = require("lodash");
const { constants } = require("../shared/constants");

const signup = async (request, response) => {
    try {
        const { name, email, password, confirmPassword } = request.body;
        if (!name || !email || !password || !confirmPassword) {
            return response.status(422).send({ error: 'Required fields are missing' });
        }

        if (password !== confirmPassword) {
            return response.status(400).send({ error: 'Password and confirm password should be same' });
        }

        if (!constants.EMAIL_REGEX.test(email)) {
            return response.status(400).send({ error: 'Invalid email format' });
        }

        const user = await userServices.findUser({ email: email.toLowerCase() });
        if (user)
            return response.status(400).send({ error: 'user with this email already exist in the system' });

        await userServices.addUser({
            name,
            email: email.toLowerCase(),
            password
        });

        return response
            .status(200)
            .json({
                message: "success in sign up"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const login = async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(422).send({ error: 'Email or password is missing!' });
        }

        const user = await userServices.findUser({ email: email.toLowerCase() });
        if (!user)
            return response.status(403).send({ error: 'Incorrect email provided!' });

        const isCorrectPass = await bcrypt.compare(password, user.password);
        if (!isCorrectPass)
            return response.status(403).send({ error: 'Password incorrect!' });

        const accessToken = jwtServices.generateAccessToken(user);

        return response
            .set("access-control-expose-headers", "access_token")
            .header("access_token", accessToken)
            .status(200)
            .json({
                user
            });

    } catch (error) {
        console.log('Exception login', error);
        response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

module.exports = {
    signup,
    login
};
