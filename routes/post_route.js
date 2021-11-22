const router = require('express').Router();
const Literature = require('../models/data/literature');
const Genre = require('../models/data/genre');
const Chapter = require('../models/data/chapter');
const {verifyToken} = require("../utils/token_manager");
const contentController = require('../controllers/post_controller');

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

module.exports = router;