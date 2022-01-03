const express = require('express');

const router = express.Router();

const {NotificationController} = require('../controllers');
const {verifyToken} = require("../middlewares");

router.get('/notifications', verifyToken, NotificationController.getNotifications);

module.exports = router