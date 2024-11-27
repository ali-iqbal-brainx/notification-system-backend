const userServices = require('../services/userServices');
const followServices = require('../services/followServices');
const { constants } = require("../shared/constants");

const userListing = async (request, response) => {
    try {
        const user = request.user;
        let { search } = request.query;
        if (!search)
            search = "";

        let followersAndFollowings = await followServices.followAggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { followerId: user?._id },
                                { followingId: user?._id }
                            ]
                        },
                        { status: constants.REQUEST_STATUS.approved }
                    ]

                }
            },
            {
                $addFields: {
                    userId: {
                        $cond: {
                            if: { $eq: ["$followerId", user?._id] },
                            then: "$followingId",
                            else: "$followerId"
                        }
                    }
                }
            },
            {
                $project: { userId: 1 }
            }
        ]);
        followersAndFollowings = followersAndFollowings?.map(obj => obj?.userId) || [];
        followersAndFollowings = [...followersAndFollowings, user?._id];

        let users = await userServices.userAggregate([
            {
                $match: {
                    _id: { $nin: followersAndFollowings },
                    $or: [
                        ...(search
                            ? [{
                                'name': {
                                    $regex: search,
                                    $options: 'i',
                                },
                            }]
                            : [{}]),
                        ...(search
                            ? [{
                                'email': {
                                    $regex: search,
                                    $options: 'i',
                                },
                            }]
                            : [{}]),
                    ]
                }
            },
            {
                $lookup: {
                    from: "follows",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ["$followerId", user?._id] },
                                                { $eq: ["$followingId", "$$userId"] },
                                                { $eq: ["$status", constants.REQUEST_STATUS.pending] }
                                            ]
                                        },
                                        {
                                            $and: [
                                                { $eq: ["$followerId", "$$userId"] },
                                                { $eq: ["$followingId", user?._id] },
                                                { $eq: ["$status", constants.REQUEST_STATUS.pending] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "followDetail"
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    followDetail: 1
                }
            }
        ]);

        return response
            .status(200)
            .json({
                message: "success",
                data: users
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

module.exports = {
    userListing
};
