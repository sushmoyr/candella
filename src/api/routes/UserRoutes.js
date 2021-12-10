const express = require('express');
const {verifyToken} = require("../middlewares");
const {UserController} = require('../controllers')

const router = express.Router();

//update user information
router.put('/update', verifyToken, UserController.updateUser);

router.get('/info', verifyToken, UserController.getCurrentUser);

router.get('/info/:id', verifyToken, UserController.getUserById);

router.get('/', UserController.getAllUsers);

router.post('/follow/:id', verifyToken, UserController.followUser);

router.post('/unfollow/:id', verifyToken, UserController.unfollowUser);

router.post('/save/:id', verifyToken, UserController.savePost);

router.get('/save', verifyToken, UserController.getSavedPosts);

module.exports = router;