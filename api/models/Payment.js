const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Payment = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdOn: {
    type:Date,
    default:Date.now
},
  month: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ['cash', 'check', 'bank transfer'],
    required: true
  },
  note: {
    type: String
  }
});

module.exports = mongoose.model('Payment', Payment)
