const {NotificationService} = require("../services");
const getNotifications = async (req, res) => {
    const {id} = req.user;
    const snapshot = await NotificationService.readNotification(id);
    res.status(snapshot.code).json((snapshot.hasData) ? snapshot.data : snapshot.error);
}

module.exports = {getNotifications}