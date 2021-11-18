const router = require('express').Router();
const Literature = require('../models/data/literature');
const Genre = require('../models/data/genre');
const Chapter = require('../models/data/chapter');
const {verifyToken} = require("../utils/token_manager");
const contentController = require('../controllers/post_controller');

//Literature Post
router.post('/', verifyToken, contentController.create);

router.get('/', contentController.readMix);

router.get('/:division', contentController.readDiv)


module.exports = router;