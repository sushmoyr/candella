const router = require('express').Router();

const {ContentController} = require('../controllers');
const {
    verifyToken,
    verifyPostOwner,
    validateContentData,
    updateContentRequest,
    validateChapter
} = require("../middlewares");

/* Metadata Routes */
//create content
router.post('/', verifyToken, validateContentData, ContentController.createContent);

//read multiple content
router.get('/', ContentController.readContents);

//read single content by id
router.get('/:id', ContentController.readContent);

//edit single content
router.put('/:id', verifyToken, validateContentData, updateContentRequest, ContentController.updateContent);

//delete single content
router.delete('/:id', verifyToken, ContentController.deleteContent);

/* Chapter Data Routes */
//add chapter*
router.post('/chapter', verifyToken, validateChapter, ContentController.addChapter);

//get chapter by id *
router.get('/chapter/:chapterId', verifyToken, ContentController.getChapter);

//get chapters*
router.get('/chapters/:postId', verifyToken, ContentController.getChapters);

//update chapter*
router.put('/chapter/:chapterId', verifyToken, validateChapter, ContentController.updateChapter);

//delete chapter*
router.delete('/chapter/:chapterId', verifyToken, ContentController.deleteChapter)

/* Review Data Routes */
//add review*
router.post('/review', verifyToken, ContentController.addReview);

//get single review*
router.get('/review/:reviewId', ContentController.getReview);

//get all reviews of a post*
router.get('/reviews/:postId', ContentController.getReviews);

//edit a review*
router.put('/review/:reviewId', verifyToken, ContentController.updateReview);

//delete review*
router.delete('/review/:reviewId', verifyToken, ContentController.deleteReview)

/* Comment Data Routes */
//add comment to chapter*
router.post('/thought', verifyToken, ContentController.addThought);

//get comments of chapter*
router.get('/thoughts/:chapterId', ContentController.getThoughts);

//get single comment from chapter*
router.get('/thought/:id', ContentController.getThought);

//edit comment of chapter*
router.put('/thought/:id', verifyToken, ContentController.updateThought);

//delete comment of chapter*
router.delete('/thought/:id', verifyToken, ContentController.deleteThought)

/* Rating Data Routes*/
//add rating to chapter*
router.post('/rating', verifyToken, ContentController.addRating);

//get ratings of chapter*
router.get('/ratings/:chapterId', ContentController.getRatings);

//get rating from chapter*
router.get('/rating/:id', ContentController.getRating);

//update rating*
router.put('/rating/:id', verifyToken, ContentController.updateRating);

//delete rating*
router.delete('/rating/:id', verifyToken, ContentController.deleteRating);

//Feature Post
router.get('/featured/all', ContentController.featured);


module.exports = router