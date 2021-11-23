const router = require('express').Router();
const {verifyToken} = require("../utils/token_manager");
const contentController = require('../controllers/content/post_controller');
const ratingsController = require('../controllers/content/ratings_controller');
const chapterController = require('../controllers/content/chapter_controller');
const thoughtController = require('../controllers/content/thoughts_controller');

/**
 * Content CRUD Routes
 */
//Add Content
router.post('/', verifyToken, contentController.create);
//Read all types of contents
router.get('/', contentController.readMix);
//Read contents by division
router.get('/d/:division', contentController.readDiv);
//Read content by division and id (Single)
router.get('/d/:division/:id', contentController.readByDivId);
//Read a content of any type by id
router.get('/i/content/:id', contentController.readMixById);
//UPDATE single post by division and id
router.put('/d/:division/:id', verifyToken, contentController.updateByDivIdReq);
//UPDATE from mix by id
router.put('/i/content/:id', verifyToken, contentController.updateMixById);
//DELETE single post by division and id
router.delete('/d/:division/:id', verifyToken, contentController.deleteByDivId);
//DELETE from mix by id
router.delete('/i/content/:id', verifyToken, contentController.deleteById);

/**
 * Ratings CRUD Routes
 */
//ADD a new rating by id
router.post('/rate/:id', verifyToken, ratingsController.addRating);
//Get all ratings of a post
router.get('/rate/:id', verifyToken, ratingsController.getRatings);
//Update a rating of a post
router.put('/rate/:id/:ratingId', verifyToken, ratingsController.updateRating);
//DELETE a rating from a post
router.delete('/rate/:id/:ratingId', verifyToken, ratingsController.deleteRating);

/**
 * Chapters CRUD Routes
 */

//ADD a new chapter by id
router.post('/chapter/:id', verifyToken, chapterController.addChapter);
//Get all chapters of a post
router.get('/chapter/:id', verifyToken, chapterController.getAllChapters);
//Get single chapter of a post
router.get('/chapter/:id/:chapterId', verifyToken, chapterController.getChapter);
//Update a chapter of a post
router.put('/chapter/:id/:chapterId', verifyToken, chapterController.updateChapter);
//DELETE a chapter from a post
router.delete('/chapter/:id/:chapterId', verifyToken, chapterController.deleteChapter);

/**
 * Thoughts CRUD Routes
 */

//ADD a new chapter by id
router.post('/thoughts/:id', verifyToken, thoughtController.addThought);
//Get all chapters of a post
router.get('/thoughts/:id', verifyToken, thoughtController.getAllThought);
//Get single chapter of a post
router.get('/thoughts/:id/:thoughtId', verifyToken, thoughtController.getThought);
//Update a chapter of a post
router.put('/thoughts/:id/:thoughtId', verifyToken, thoughtController.updateThought);
//DELETE a chapter from a post
router.delete('/thoughts/:id/:thoughtId', verifyToken, thoughtController.deleteThought);


module.exports = router;