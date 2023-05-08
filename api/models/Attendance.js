const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  students: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent','Late'],
      default: 'Present',
    },
  }],
});

module.exports = mongoose.model('Attendance', AttendanceSchema);