const {NotificationService} = require("../services");
const getNotifications = async (req, res) => {
    const snapshot = await NotificationService.readNotification();
    res.status(snapshot.code).json((snapshot.hasData) ? snapshot.data : snapshot.error);
}

module.exports = {getNotifications}