const mongoose = require('mongoose');
const jwtServices = require("../services/jwtServices");
const userServices = require("../services/userServices");

const verifyAuth = async (request, response, next) => {
    const authHeader = request.headers.access_token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwtServices.verifyToken(
            token,
            process.env.JWT_TOKEN_KEY,
            async (err, user) => {
                if (err) {
                    return response
                        .status(401)
                        .json({ error: "Token is not valid!" });
                }

                const dbUser = await userServices.findUser({ _id: new mongoose.Types.ObjectId(user._id) });

                if (!dbUser)
                    return response
                        .status(401)
                        .json({ error: "User not found" });

                const decoded = jwtServices.decodeToken(token);
                if (!decoded) {
                    return response
                        .status(401)
                        .json({ error: "Token is not valid!" });
                }

                request.user = dbUser;
                next();
            }
        );
    } else {
        return response
            .status(403)
            .json({
                error: "'access_token' required in headers"
            });
    }
};

module.exports = {
    verifyAuth
};
