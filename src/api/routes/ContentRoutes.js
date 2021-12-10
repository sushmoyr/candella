const router = require('express').Router();

const {ContentController} = require('../controllers');
const {verifyToken, verifyPostOwner, validateContentData, updateContentRequest} = require("../middlewares");

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

module.exports = router