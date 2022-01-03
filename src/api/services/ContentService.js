const Content = require('../models/Content');
const DocumentSnapshot = require('../models/DocumentSnapshot');
const Review = require('../models/Review');
const Chapter = require('../models/Chapter');
const {StatusCodes, Notification_Types} = require("../helpers");
const {SelectModel, Thought, Rating} = require("../models");
const UserService = require("./UserService");

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
        select: '-__v'
    },
    {
        path: 'category',
        select: '-__v'
    },
    {
        path: 'author',
        select: '_id email name pen_name profileImage coverImage'
    },
    {
        path: 'chapters',
        select: '_id, chapterName'
    },
    {
        path: 'reviews',
        select: '-__v'
    }
]

const getSingleContent = async (filter, shouldPopulate = true, updateViewCount = true) => {
    const populate = (shouldPopulate) ? contentPopulationConfig : '';
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

        //console.log({reviews})

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

/* Chapter Section */

//Create Chapter
const createChapter = async (data) => {
    try {
        const chapter = await Chapter.create({...data});
        //console.log({chapter})
        const contentSnapshot = await addToContentArray(data.contentId, 'chapters', chapter['_id']);
        //console.log({contentSnapshot});
        if (contentSnapshot.hasError)
            return contentSnapshot;
        return createSnapshot(chapter);
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

//get single chapter by id
const getChapter = async (id) => {
    try {
        const chapter = await Chapter.findById(id).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }]);

        return (chapter)
            ? createSnapshot(chapter, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        console.log(e)
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

//get all chapters
const getChapters = async (postId) => {
    try {
        const chapters = await Chapter.find({contentId: postId}).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }])

        console.log({chapters})

        return (chapters)
            ? createSnapshot(chapters, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

//update a chapter
const updateChapter = async (id, updateData) => {
    try {
        const data = await Chapter.findOneAndUpdate({
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

//delete a chapter by id
const deleteChapter = async (id) => {
    try {
        const data = await Chapter.findByIdAndDelete(id);

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to delete this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

/* Comment Data Section */

//add comment to chapter
const createThought = async (data) => {
    try {
        const thought = await Thought.create({...data});
        sendThoughtNotification(thought).then(r => console.log('notification sent')).catch(e => console.log(e));
        return createSnapshot(thought);
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

//get comments of chapter
const getThought = async (id) => {
    try {
        const thought = await Thought.findById(id).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }]);

        return (thought)
            ? createSnapshot(thought, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

//get single comment from chapter
const getThoughts = async (chapterId) => {
    try {
        const thoughts = await Thought.find({chapterId: chapterId}).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }])

        console.log({thoughts})

        return (thoughts)
            ? createSnapshot(thoughts, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

//edit comment of chapter
const updateThought = async (id, updateData) => {
    try {
        const data = await Thought.findOneAndUpdate({
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

//delete comment of chapter
const deleteThought = async (id) => {
    try {
        const data = await Thought.findByIdAndDelete(id);

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to delete this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}


/* Rating Data Section */

//add rating to chapter
const createRating = async (data) => {
    try {
        const rating = await Rating.create({...data});
        sendRatingNotification(rating).then(r => console.log('notification sent')).catch(e => console.log(e));
        return createSnapshot(rating);
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

//get single rating of a chapter
const getRating = async (id) => {
    try {
        const rating = await Rating.findById(id).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }]);

        return (rating)
            ? createSnapshot(rating, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

//get ratings from chapter
const getRatings = async (chapterId) => {
    try {
        const ratings = await Rating.find({chapterId: chapterId}).populate([{
            path: 'author',
            select: '_id email name pen_name profileImage coverImage'
        }])

        console.log({ratings})

        return (ratings)
            ? createSnapshot(ratings, StatusCodes.OK)
            : createErrorSnapshot(StatusCodes.NOT_FOUND, 'Content Not Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

//edit rating of chapter
const updateRating = async (id, updateData) => {
    try {
        const data = await Rating.findOneAndUpdate({
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

//delete rating of chapter
const deleteRating = async (id) => {
    try {
        const data = await Rating.findByIdAndDelete(id);

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.UNAUTHORIZED, 'You don\' have permission to delete this content');
    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e)
    }
}

/* Notification Block */


const sendReviewNotification = async (review) => {
    const content = await getSingleContent({_id: review.contentId}, true, false);
    const owner = content.data.author;
    const reviewOwnerSnapshot = await UserService.getById(review.author, true);
    const reviewOwner = reviewOwnerSnapshot.data;

    if (owner._id.toString() === review.author.toString())
        return;

    await __dispatchNotification({
        owner: owner._id,
        message: `${reviewOwner.name} reviewed your content ${content.data.title}`,
        type: Notification_Types.REVIEWED_BY,
        data: {
            reviewBy: {...owner},
            review: review
        }
    });
}

const sendRatingNotification = async (rating) => {
    const chapter = await getChapter(rating.author.toString());
    if (chapter.hasData) {
        const content = await getSingleContent({_id: chapter.data.author});
        const owner = content.data.author;

        if (owner._id.toString() === rating.author.toString())
            return;

        await __dispatchNotification({
            owner: owner._id,
            message: `${owner.name} Rated your content ${content.data.title}`,
            type: Notification_Types.RATED_BY,
            data: {
                ratedBy: {...owner},
                rating: rating
            }
        });
    }
}

const sendThoughtNotification = async (thought) => {
    const chapter = await getChapter(thought.author.toString());
    if (chapter.hasData) {
        const content = await getSingleContent({_id: chapter.data.author});
        const owner = content.data.author;

        if (owner._id.toString() === thought.author.toString())
            return;

        await __dispatchNotification({
            owner: owner._id,
            message: `${owner.name} Commented on your content ${content.data.title}`,
            type: Notification_Types.RATED_BY,
            data: {
                ratedBy: {...owner},
                rating: thought
            }
        });
    }
}

/* Random Service Helpers */

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

//Featured
const featured = async () => {
    console.log(Number(process.env.featured_limit))
    const select = '-__v';
    try {
        const data = await Content.find()
            .sort([['views', 'desc']])
            .limit(Number(process.env.featured_limit))
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

const search = async (query) => {
    console.log('Searching with text: ', query);

    try {
        const data = await Content.find({
            $text: {
                $search: query
            }
        }).populate(contentPopulationConfig);

        if (data)
            return createSnapshot(data);
        else
            return createErrorSnapshot(StatusCodes.NOT_FOUND, 'No Content Found');

    } catch (e) {
        return createErrorSnapshot(StatusCodes.BAD_REQUEST, e);
    }
}

module.exports = {
    createContent, getSingleContent, getAllContents, updateContent, deleteContent,
    createReview, getSingleReview, getAllReviews, updateReview, deleteReview,
    createChapter, getChapter, getChapters, updateChapter, deleteChapter,
    createThought, getThought, getThoughts, updateThought, deleteThought,
    createRating, getRating, getRatings, updateRating, deleteRating,
    featured, search
}

/*
$or: [
                {title: query},
                {description: query},
                {tags: query},
            ]
 */