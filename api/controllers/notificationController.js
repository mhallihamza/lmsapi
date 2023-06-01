const Notification = require('../models/Notification');

exports.createNotification = (req, res) => {
  const { message, senderId, receiverIds } = req.body;

  // Create an array of notification objects, with the same sender and message, but different receivers
  const notifications = receiverIds.map(receiverId => ({
    sender: senderId,
    message: message,
    receiver: receiverId,
  }));

  // Use the insertMany() method to create all the notifications at once
  Notification.insertMany(notifications)
    .then(createdNotifications => {
      console.log('Created notifications:', createdNotifications);
      res.status(201).json(createdNotifications);
    })
    .catch(error => {
      console.error('Error creating notifications:', error);
      res.status(500).send(error);
    });
};

exports.findNotificationByReceiverId = (req, res) => {
  const receiverId = req.params.id;
  Notification.find({ receiver: receiverId })
    .then(foundNotifications => {
      res.status(200).json(foundNotifications);
    })
    .catch(error => {
      console.error('Error finding notifications:', error);
      res.status(500).send('Error finding notifications');
    });
};

exports.deleteAllNotifications = (req,res) =>{
  Notification.deleteMany({})
  .then(notification=>{
    res.status(200).json({ message: 'Notifications deleted successfully' });
  })
  .catch((error) => {
    res.status(500).json({ message: 'Error deleting notification' });
  });
}

exports.deleteNotificationsToStudent = (req,res) =>{
  Notification.deleteMany({receiver:req.params.id})
  .then(notification=>{
    res.status(200).json({ message: 'Notifications deleted successfully' });
  })
  .catch((error) => {
    res.status(500).json({ message: 'Error deleting notification' });
  });
}
