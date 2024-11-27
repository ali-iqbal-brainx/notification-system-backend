const jwt = require("jsonwebtoken");

const generateAccessToken = (user, expiry) => {
    if (expiry) {
        return jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_KEY, { expiresIn: expiry });
    }
    return jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_KEY);
}

const verifyToken = (token, key, callback) => {
    jwt.verify(token, key, (err, user) => callback(err, user));
};

const decodeToken = (token) => {
    return jwt.decode(token, { complete: true, json: true });
};

module.exports = {
    generateAccessToken,
    verifyToken,
    decodeToken
};