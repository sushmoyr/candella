const express = require('express');

const router = express.Router();

const {NotificationController} = require('../controllers');
const {verifyToken} = require("../middlewares/VerifyUser");

router.get('/notifications', NotificationController.getNotifications);

module.exports = router