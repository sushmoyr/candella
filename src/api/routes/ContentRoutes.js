const router = require('express').Router();

const {ContentController} = require('../controllers');
const {verifyToken, verifyPostOwner, validateContentData, updateContentRequest} = require("../middlewares");

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
//add chapter
router.post('/chapter', verifyToken, ContentController.addChapter);

//get chapter by id
router.get('/chapter/:chapterId', verifyToken, ContentController.getChapter);

//get chapters
router.get('/chapters/:postId', verifyToken, ContentController.getChapters);

//update chapter
router.put('/chapter/:chapterId', verifyToken, ContentController.updateChapter);

//delete chapter
router.delete('/chapter/:chapterId', verifyToken, ContentController.deleteChapter)

/* Review Data Routes */
//add review
router.post('/review', verifyToken, ContentController.addReview);

//get single review
router.get('/review/:reviewId', ContentController.getReview);

//get all reviews of a post
router.get('/reviews/:postId', ContentController.getReviews);

//edit a review
router.put('/review/:reviewId', verifyToken, ContentController.updateReview);

//delete review
router.delete('/review/:reviewId', verifyToken, ContentController.deleteReview)

/* Comment Data Routes */
//add comment to chapter

//get comments of chapter

//get single comment from chapter

//edit comment of chapter

//delete comment of chapter

/* Rating Data Routes*/
//add rating to chapter

//get ratings of chapter

//get rating from chapter

//update rating

//delete rating


module.exports = router