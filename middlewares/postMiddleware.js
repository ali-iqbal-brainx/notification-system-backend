const postServices = require("../services/postServices");
const followServices = require("../services/followServices");
const { constants } = require('../shared/constants');

const postGuard = async (request, response, next) => {
    const user = request.user;
    const { postId } = request.body;

    if (postId) {
        const post = await postServices.findPost({
            _id: postId
        });

        if (!post) {
            return response
                .status(404)
                .json({
                    error: "post with this id not found"
                });
        }

        if (user?._id?.toString() === post?.userId?.toString()) {
            request.userOwnPost = true;
            next();
        } else {
            request.userOwnPost = false;
            let follow = await followServices.findFollow({
                followerId: post?.userId,
                followingId: user?._id,
                status: constants.REQUEST_STATUS.approved
            });

            if (!follow) {
                follow = await followServices.findFollow({
                    followerId: user?._id,
                    followingId: post?.userId,
                    status: constants.REQUEST_STATUS.approved
                });

                if (!follow) {
                    return response
                        .status(400)
                        .json({
                            error: "User is not allowed to do this action"
                        });
                }
            }

            next();
        }
    } else {
        return response
            .status(422)
            .json({
                error: "Required field is missing"
            });
    }
};

module.exports = {
    postGuard
};
