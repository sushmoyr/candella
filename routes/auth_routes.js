const {authController} = require("../controllers/controllers");
const {verifyToken} = require("../utils/token_manager");
const router = require('express').Router();

router.post('/login', authController.login);

router.post('/create', authController.register);

router.post('/logout', verifyToken, authController.logout);

module.exports = router;