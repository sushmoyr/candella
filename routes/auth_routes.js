const {authController} = require("../controllers/controllers");
const router = require('express').Router();

router.post('/login', authController.login);

router.post('/create', authController.register);

router.post('/logout', authController.logout);

module.exports = router;