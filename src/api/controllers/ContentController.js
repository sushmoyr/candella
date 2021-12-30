//create content
const {ContentService, UserService} = require("../services");
const {Success, Error} = require("../models");
const {StatusCodes, QueryHelper} = require("../helpers");
const createContent = async (req, res) => {
    console.log('Create Content');
    const contentData = req.body;
    const snapshot = await ContentService.createContent(contentData);

    console.log({snapshot})

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Successfully Created',
            body: snapshot.data
        }));
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));
}
//read single content by id
const readContent = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.getSingleContent({_id: id})

    console.log({snapshot})

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(snapshot.data);
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));
}
//read multiple content
const readContents = async (req, res) => {
    const options = QueryHelper.pagination(req);
    const filter = QueryHelper.filter(req);
    const snapshot = await ContentService.getAllContents(filter, options);

    console.log({snapshot});

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(snapshot.data);
    } else {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    }
}
//edit single content
const updateContent = async (req, res) => {
    const {id} = req.params
    const author = req.user.id;
    const snapshot = await ContentService.updateContent(id, author, req.body);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Content Successfully Updated',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));

}
//delete single content
const deleteContent = async (req, res) => {
    const {id} = req.params
    const author = req.user.id;
    const snapshot = await ContentService.deleteContent(id, author);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Content Successfully Deleted',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

//add chapter
const addChapter = async (req, res) => {

    const snapshot = await ContentService.createChapter(req.body);

    console.log({snapshot})

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Successfully Created',
            body: snapshot.data
        }));
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));
}

//get chapter by id
const getChapter = async (req, res) => {
    const {chapterId} = req.params;
    const snapshot = await ContentService.getChapter(chapterId);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}

//get all chapters
const getChapters = async (req, res) => {
    const {postId} = req.params;
    const snapshot = await ContentService.getChapters(postId);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}

//update chapter
const updateChapter = async (req, res) => {
    const {chapterId} = req.params;
    const snapshot = await ContentService.updateChapter(chapterId, req.body);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Chapter Successfully Updated',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

//delete chapter by id
const deleteChapter = async (req, res) => {
    const {chapterId} = req.params;
    const snapshot = await ContentService.deleteChapter(chapterId);
    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Chapter Successfully Deleted',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}


/* Review Data Section */
//add review
const addReview = async (req, res) => {
    const author = req.user.id;
    let data = req.body;
    data.author = author;

    const snapshot = await ContentService.createReview(data);

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Successfully Created',
            body: snapshot.data
        }));
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));

}

//get single review
const getReview = async (req, res) => {
    const {reviewId} = req.params;
    const snapshot = await ContentService.getSingleReview(reviewId);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}

//get all reviews
const getReviews = async (req, res) => {
    const {postId} = req.params;
    const snapshot = await ContentService.getAllReviews(postId);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}

//edit review
const updateReview = async (req, res) => {
    const {reviewId} = req.params;
    const snapshot = await ContentService.updateReview(reviewId, req.body);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Review Successfully Updated',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

//delete review
const deleteReview = async (req, res) => {
    const {reviewId} = req.params;
    const snapshot = await ContentService.deleteReview(reviewId);
    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Review Successfully Deleted',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

/* Comment Data Section */
//add comment to chapter
const addThought = async (req, res) => {
    const author = req.user.id;
    let data = req.body;
    data.author = author;

    const snapshot = await ContentService.createThought(data);

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Successfully Created',
            body: snapshot.data
        }));
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));

}
//get single comment of chapter
const getThought = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.getThought(id);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}
//get comments from chapter
const getThoughts = async (req, res) => {
    const {chapterId} = req.params;
    const snapshot = await ContentService.getThoughts(chapterId);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}
//edit comment of chapter
const updateThought = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.updateThought(id, req.body);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Thought Successfully Updated',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}
//delete comment of chapter
const deleteThought = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.deleteThought(id);
    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Thought Successfully Deleted',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

/* Rating Data Sections*/
//add rating to chapter
const addRating = async (req, res) => {
    const author = req.user.id;
    let data = req.body;
    data.author = author;

    const snapshot = await ContentService.createRating(data);

    if (snapshot.hasData) {
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Successfully Created',
            body: snapshot.data
        }));
    } else if (snapshot.hasError) {
        return res.status(snapshot.code).json(new Error({
            code: snapshot.code,
            message: `Error: ${snapshot.error}`
        }))
    } else
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new Error({}));

}
//get ratings of chapter
const getRating = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.getRating(id);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}
//get rating from chapter
const getRatings = async (req, res) => {
    const {chapterId} = req.params;
    const snapshot = await ContentService.getRatings(chapterId);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else {
        const err = new Error({message: snapshot.error, code: snapshot.code})
        return res.status(err.code).json(err);
    }
}
//update rating
const updateRating = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.updateRating(id, req.body);

    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Rating Successfully Updated',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}
//delete rating
const deleteRating = async (req, res) => {
    const {id} = req.params;
    const snapshot = await ContentService.deleteRating(id);
    if (snapshot.hasData)
        return res.status(snapshot.code).json(new Success({
            code: snapshot.code,
            message: 'Thought Successfully Deleted',
            body: snapshot.data
        }));
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));
}

//Featured Post
const featured = async (req, res) => {
    const snapshot = await ContentService.featured();
    if (snapshot.hasData)
        return res.status(snapshot.code).json(snapshot.data);
    else return res.status(snapshot.code).json(new Error({
        code: snapshot.code,
        message: `Error: ${snapshot.error}`
    }));

}

module.exports = {
    createContent, readContent, readContents, updateContent, deleteContent,
    addChapter, getChapter, getChapters, updateChapter, deleteChapter,
    addReview, getReview, getReviews, updateReview, deleteReview,
    addThought, getThought, getThoughts, updateThought, deleteThought,
    addRating, getRating, getRatings, updateRating, deleteRating,
    featured
}