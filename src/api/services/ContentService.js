const {Content, DocumentSnapshot, Review} = require("../models");
const {StatusCodes, Notification_Types} = require("../helpers");
const {NotificationService} = require("./index");

const createContent = async (content) => {
    try {
        const newContent = await Content.create({...content})
        console.log({newContent});
        return new DocumentSnapshot({
            code: StatusCodes.CREATED,
            data: newContent,
        })

    } catch (e) {
        return new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST,
            error: e.toString()
        });
    }
}

const contentPopulationConfig = [
    {
        path: 'genre',
        select: '_id, name'
    },
    {
        path: 'category',
        select: '_id, name'
    },
    {
        path: 'author',
        select: '_id email name pen_name profileImage coverImage'
    },
    {
        path: 'chapters',
        select: '_id, name'
    }
]

const getSingleContent = async (filter, shouldPopulate = true, updateViewCount = true) => {
    const populate = (shouldPopulate) ? contentPopulationConfig : {};
    const increment = (updateViewCount) ? 1 : 0;
    try {
        const data = await Content.findOneAndUpdate(filter, {$inc: {views: increment}}, {new: true}).populate(populate);

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const getAllContents = async (filter = null, option = null) => {
    const select = '-__v';
    console.log(option)
    try {
        const data = await Content.find(filter, select, option)
            .sort([[option.sortBy, option.order]])
            .populate(contentPopulationConfig);
        console.log(data);
        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.NOT_FOUND, 'No Content Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const updateContent = async (postId, userId, updateData) => {
    try {
        const data = await Content.findOneAndUpdate({
            _id: postId, author: userId
        }, {$set: updateData}, {new: true});

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to edit this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

const deleteContent = async (postId, userId) => {
    try {
        const data = await Content.findOneAndDelete({
            _id: postId, author: userId
        });
        console.log(data)
        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to delete this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

/* Review Section */
const createReview = async (data) => {
    try {
        const review = await Review.create({...data});
        console.log({review})
        const contentSnapshot = await addToContentArray(data.contentId, 'reviews', review['_id']);
        console.log({contentSnapshot});
        if (contentSnapshot.hasError)
            return contentSnapshot;
        //dispatch notification
        sendReviewNotification(review).then(r => console.log('notification sent')).catch(e => console.log(e));
        //return
        return createSnapshot(review);
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }

}

const sendReviewNotification = async (review) => {
    const content = await getSingleContent({_id: review.contentId}, true, false);
    const owner = content.data.author;

    await __dispatchNotification({
        owner: owner._id,
        message: `${owner.name} reviewed your content ${content.data.title}`,
        type: Notification_Types.REVIEWED_BY,
        data: {
            reviewBy: {...owner},
            review: review
        }
    });
}

const getSingleReview = async (reviewId) => {
    try {
        const review = await Review.findOne({_id: reviewId}).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }]);

        return (review)
            ? createSnapshot(review, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const getAllReviews = async (postId) => {
    try {
        const reviews = await Review.find({contentId: postId}).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }])

        console.log({reviews})

        return (reviews)
            ? createSnapshot(reviews, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const updateReview = async (id, updateData) => {
    try {
        const data = await Review.findOneAndUpdate({
            _id: id
        }, {$set: updateData}, {new: true});

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to edit this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

const deleteReview = async (id) => {
    try {
        const data = await Review.findOneAndDelete({
            _id: id
        });

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to delete this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

const addToContentArray = async (contentId, fieldName, updateData) => {
    let config = {};
    config[fieldName] = updateData
    try {
        const updated = await Content.findByIdAndUpdate(
            contentId,
            {
                $addToSet: config
            }, {new: true}
        );

        if (updated) {
            return createSnapshot(updated)
        } else {
            return createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found.')
        }

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

const createSnapshot = (data, code = null) => {
    return new DocumentSnapshot({
        code: (code) ? code : StatusCodes.CREATED,
        data: data,
    })
}


const createErrorSnapshot = (code, error) => {
    return new DocumentSnapshot({
        code: code,
        error: error.toString()
    });
}

module.exports = {
    createContent, getSingleContent, getAllContents, updateContent, deleteContent,
    createReview, getSingleReview, getAllReviews, updateReview, deleteReview
}