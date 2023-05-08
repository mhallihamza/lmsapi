const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Class = new Schema({
  name: {
    type: String,
    required: true,
  },
  //replace instructor to course
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course',
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Class", Class);

