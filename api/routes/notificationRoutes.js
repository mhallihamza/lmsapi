const express = require('express');
const router = express.Router();
const Notification = require('../controllers/notificationController.js');
router.post("",Notification.createNotification)
router.get("/:id",Notification.findNotificationByReceiverId)
router.delete("",Notification.deleteAllNotifications)
router.delete("/student/:id",Notification.deleteNotificationsToStudent)
module.exports = router