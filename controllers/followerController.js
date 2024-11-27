
const { default: mongoose } = require('mongoose');
const followServices = require('../services/followServices');
const notificationServices = require('../services/notificationServices');
const { constants, requestStatusEnum } = require('../shared/constants');

const follow = async (request, response) => {
    try {
        const user = request.user;
        let id = request.params.id;
        if (!id) {
            return response.status(422).send({ error: 'Required field is missing' });
        }
        id = new mongoose.Types.ObjectId(id);

        const follow = await followServices.addFollow({
            followerId: user?._id,
            followingId: id,
            status: constants.REQUEST_STATUS.pending
        });

        const notification = await notificationServices.addNotification({
            type: constants.NOTIFICATION_TYPE.action,
            relatedRequestId: follow?._id,
            relatedModel: "follow",
            userId: id
        });

        return response
            .status(200)
            .json({
                message: "follow request sent successfully"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const unfollow = async (request, response) => {
    try {
        const user = request.user;
        let id = request.params.id;

        if (!id) {
            return response.status(422).send({ error: 'Required field is missing' });
        }
        id = new mongoose.Types.ObjectId(id)

        const follow = await followServices.findFollow({
            _id: id,
            followerId: user?._id
        });

        if (!follow) {
            return response.status(404).send({ error: 'request not found with this id' });
        }

        await Promise.all([
            notificationServices.deleteNotifications({
                relatedRequestId: follow?._id,
                relatedModel: "follow"
            }),
            followServices.deleteFollow({
                _id: follow?._id
            })
        ]);

        return response
            .status(200)
            .json({
                message: "unfollow successfully"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const addressRequest = async (request, response) => {
    try {
        const user = request.user;
        let id = request.params.id;
        let { status } = request.body;

        if (!id || !status) {
            return response.status(422).send({ error: 'Required fields are missing' });
        }

        if (!requestStatusEnum.includes(status)) {
            return response.status(400).send({ error: 'invalid status type' });
        }

        id = new mongoose.Types.ObjectId(id);

        const follow = await followServices.findFollow({
            _id: id,
            followingId: user?._id
        });

        if (!follow) {
            return response.status(404).send({ error: 'request not found with this id' });
        }

        if (status !== "Rejected") {
            const updatedObj = await followServices.updateFollow(
                {
                    _id: follow?._id
                },
                {
                    $set: {
                        status
                    }
                },
                {
                    new: true
                }
            );

            await notificationServices.addNotification({
                type: constants.NOTIFICATION_TYPE.message,
                relatedRequestId: updatedObj?._id,
                relatedModel: "follow",
                userId: follow?.followerId
            });
        } else {
            await Promise.all([
                notificationServices.deleteNotifications({
                    relatedRequestId: follow?._id,
                    relatedModel: "follow"
                }),
                followServices.deleteFollow({
                    _id: follow?._id
                })
            ]);
        }

        return response
            .status(200)
            .json({
                message: "request addressed successfully"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

module.exports = {
    follow,
    unfollow,
    addressRequest
};
