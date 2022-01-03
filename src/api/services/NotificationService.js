const {Notification} = require('../models/index');
const {DocumentSnapshot} = require("../models");
const {StatusCodes} = require("../helpers");

const dispatchNotification = async ({owner, message, type, data}) => {
    await Notification.create({
        owner: owner,
        message: message,
        type: type,
        data: data
    }).then(data => {
        console.log('Notification Created..', data);
    }).catch(e => {
        console.error(e);
    });
}

const readNotification = async (id) => {
    const filter = {owner: id};
    try {
        const notifications = await Notification.find(filter);
        return new DocumentSnapshot({
            code: 200, data: notifications
        })
    } catch (e) {
        return new DocumentSnapshot({
            code: StatusCodes.BAD_REQUEST, error: e
        })
    }
}

global.__dispatchNotification = dispatchNotification;

module.exports = {
    dispatchNotification, readNotification
}