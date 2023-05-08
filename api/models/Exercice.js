const mongoose = require('mongoose');

const Exercice = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const Homework = mongoose.model('Exercice', Exercice);

module.exports = Homework;
