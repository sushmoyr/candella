const {userController} = require("../controllers/controllers");
const {verifyToken} = require("../utils/token_manager");
const router = require('express').Router();
//update user information
router.put('/update', verifyToken, userController.updateUser);

router.get('/info', verifyToken, userController.getCurrentUser);

router.get('/info/:id', verifyToken, userController.getUserById);

router.get('/all', userController.getAllUsers);


module.exports = router;