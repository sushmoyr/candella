const {userController} = require("../controllers/controllers");
const {verifyToken} = require("../utils/token_manager");
const router = require('express').Router();
//update user information
router.put('/update', verifyToken, userController.updateUser);

router.get('/info', verifyToken, userController.getCurrentUser);

router.get('/info/:id', verifyToken, userController.getUserById);

router.get('/all', userController.getAllUsers);

router.post('/follow/:id', verifyToken, userController.followUser);

router.post('/unfollow/:id', verifyToken, userController.unfollowUser);

router.post('/save/:id', verifyToken, userController.savePost);

router.get('/save', verifyToken, userController.getSavedPosts);

module.exports = router;