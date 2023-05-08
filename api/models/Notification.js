const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Notification = new Schema({
  message: {
    type: String,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver:{
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdOn: {
    type:Date,
    default:Date.now
}
  });

module.exports = mongoose.model("Notification", Notification);
