const notificationServices = require('../services/notificationServices');
const { constants } = require('../shared/constants');

const getNotifications = async (request, response) => {
    try {
        const user = request.user;
        let { actionNoti } = request.query;
        if (!actionNoti)
            actionNoti = false;

        if (actionNoti === "true") {
            actionNoti = true;
        } else {
            actionNoti = false
        }

        const notifications = await notificationServices.notificationAggregate([
            {
                $match: {
                    userId: user?._id,
                    ...(actionNoti ? { type: constants.NOTIFICATION_TYPE.action } : {})
                }
            },
            {
                $facet: {
                    likes: [
                        { $match: { relatedModel: "like" } },
                        {
                            $lookup: {
                                from: "likes",
                                let: { requestId: "$relatedRequestId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$requestId"] }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "userId",
                                            foreignField: "_id",
                                            as: "userDetail"
                                        }
                                    },
                                    { $unwind: { path: "$userDetail", preserveNullAndEmptyArrays: true } },
                                    {
                                        $project: {
                                            postId: 1,
                                            createdAt: 1,
                                            updatedAt: 1,
                                            userDetail: {
                                                _id: 1,
                                                name: 1,
                                                email: 1
                                            }
                                        }
                                    }
                                ],
                                as: "relatedData"
                            }
                        },
                        { $unwind: { path: "$relatedData", preserveNullAndEmptyArrays: true } }
                    ],
                    follows: [
                        { $match: { relatedModel: "follow" } },
                        {
                            $lookup: {
                                from: "follows",
                                let: { requestId: "$relatedRequestId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$requestId"] }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "followerId",
                                            foreignField: "_id",
                                            as: "followerDetail"
                                        }
                                    },
                                    { $unwind: { path: "$followerDetail", preserveNullAndEmptyArrays: true } },
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "followingId",
                                            foreignField: "_id",
                                            as: "followingDetail"
                                        }
                                    },
                                    { $unwind: { path: "$followingDetail", preserveNullAndEmptyArrays: true } },
                                    {
                                        $project: {
                                            followerId: 1,
                                            followingId: 1,
                                            status: 1,
                                            updatedAt: 1,
                                            createdAt: 1,
                                            followerDetail: {
                                                _id: 1,
                                                name: 1,
                                                email: 1
                                            },
                                            followingDetail: {
                                                _id: 1,
                                                name: 1,
                                                email: 1
                                            }
                                        }
                                    }
                                ],
                                as: "relatedData"
                            },

                        },
                        { $unwind: { path: "$relatedData", preserveNullAndEmptyArrays: true } },
                    ]
                }
            },
            {
                $project: {
                    results: { $concatArrays: ["$likes", "$follows"] }
                }
            },
            { $unwind: "$results" },
            {
                $replaceRoot: { newRoot: "$results" }
            },
            {
                $sort: {
                    "relatedData.updatedAt": -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetail"
                }
            },
            { $unwind: { path: "$userDetail", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    type: 1,
                    relatedRequestId: 1,
                    relatedModel: 1,
                    relatedData: 1,
                    userDetail: 1
                }
            }
        ]);

        return response
            .status(200)
            .json({
                message: "success",
                data: notifications
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

module.exports = {
    getNotifications
};
