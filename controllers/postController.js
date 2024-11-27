const postServices = require('../services/postServices');
const likeServices = require('../services/likeServices');
const followServices = require('../services/followServices');
const notificationServices = require('../services/notificationServices');
const { default: mongoose } = require('mongoose');
const { constants } = require('../shared/constants');

const addPost = async (request, response) => {
    try {
        const user = request.user;
        const { title, text } = request.body;
        if (!title || !text) {
            return response.status(422).send({ error: 'Required fields are missing' });
        }

        const newPost = await postServices.addPost({
            title,
            text,
            userId: user?._id
        });

        return response
            .status(200)
            .json({
                message: "post added successfully",
                data: newPost
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const deletePost = async (request, response) => {
    try {
        const user = request.user;
        let postId = request.params.id;

        if (!postId) {
            return response.status(422).send({ error: 'Required field is missing' });
        }
        postId = new mongoose.Types.ObjectId(postId)

        const post = await postServices.findPost({
            _id: postId
        });

        if (!post) {
            return response.status(404).send({ error: 'post not found' });
        }
        if (post?.userId?.toString() !== user?._id?.toString()) {
            return response.status(400).send({ error: 'access denied for this permission' });
        }

        const likes = await likeServices.findLikes({
            postId
        });

        await Promise.all([
            postServices.deletePost({
                _id: postId
            }),
            likeServices.deleteLikes({
                postId
            }),
            notificationServices.deleteNotifications({
                relatedModel: "like",
                relatedRequestId: { $in: likes?.length ? likes.map(like => like._id) : [] }
            })
        ])

        return response
            .status(200)
            .json({
                message: "post deleted successfully"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const likePost = async (request, response) => {
    try {
        const user = request.user;
        const userOwnPost = request.userOwnPost;
        let { postId } = request.body;

        if (!postId) {
            return response.status(422).send({ error: 'Required field is missing' });
        }
        postId = new mongoose.Types.ObjectId(postId)

        const post = await postServices.findPost({
            _id: postId
        });

        if (!post) {
            return response.status(404).send({ error: 'post not found' });
        }

        let like = await likeServices.findLike({
            userId: user?._id,
            postId
        });

        if (!like) {
            like = await likeServices.addLike({
                postId: postId,
                userId: user?._id
            });
        }

        if (!userOwnPost) {
            await notificationServices.addNotification({
                type: constants.NOTIFICATION_TYPE.message,
                relatedRequestId: like?._id,
                relatedModel: "like",
                userId: post?.userId
            });
        }

        return response
            .status(200)
            .json({
                message: "post liked successfully"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const unlikePost = async (request, response) => {
    try {
        const user = request.user;
        let likeId = request.params.id;

        if (!likeId) {
            return response.status(422).send({ error: 'Required field is missing' });
        }
        likeId = new mongoose.Types.ObjectId(likeId)

        const like = await likeServices.findLike({
            _id: likeId
        });

        if (!like) {
            return response
                .status(200)
                .json({
                    message: "post unlike liked successfully"
                });
        }

        if (like?.userId?.toString() !== user?._id?.toString()) {
            return response
                .status(400)
                .json({
                    error: "access denied for this operation"
                });
        }

        await Promise.all([
            notificationServices.deleteNotifications({
                relatedModel: "like",
                relatedRequestId: likeId
            }),
            likeServices.deleteLike({
                _id: likeId
            })
        ]);

        return response
            .status(200)
            .json({
                message: "post unlike liked successfully"
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

const postListing = async (request, response) => {
    try {
        const user = request.user;
        let { search } = request.query;
        if (!search)
            search = "";

        let userIds = await followServices.followAggregate([
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
        userIds = userIds?.map(obj => obj?.userId) || [];
        userIds = [...userIds, user?._id];

        const posts = await postServices.postAggregate([
            {
                $match: {
                    userId: { $in: userIds },
                    $or: [
                        ...(search
                            ? [{
                                'title': {
                                    $regex: search,
                                    $options: 'i',
                                },
                            }]
                            : [{}]),
                        ...(search
                            ? [{
                                'text': {
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
                    from: "likes",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$postId", "$$id"]
                                }
                            }
                        }
                    ],
                    as: "likeDetail"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: { id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postId", "$$id"] },
                                        { $eq: ["$userId", user?._id] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userLike"
                }
            },
            {
                $addFields: {
                    isUserItselfLike: {
                        $cond: {
                            if: { $gte: [{ $size: "$userLike" }, 1] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return response
            .status(200)
            .json({
                message: "success",
                data: posts
            });

    } catch (error) {
        console.log('Exception login', error);
        return response.status(500).send({
            error: error?.message ? error.message : 'Something went wrong',
        });
    }
};

module.exports = {
    addPost,
    deletePost,
    likePost,
    unlikePost,
    postListing
};
