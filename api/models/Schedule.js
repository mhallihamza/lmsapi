const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Schedule = new Schema({
  class: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  weekday: {
    type: Number, // 0 = Sunday, 1 = Monday, etc.
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  room: {
    type: Number,
    required: true
  },
  createdOn: {
    type:Date,
    default:Date.now
}
});

module.exports = mongoose.model("Schedule", Schedule);
