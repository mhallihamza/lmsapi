const Payment = require('../models/Payment');
// listAllClass function - To list all Users
exports.listAllPayment = (req, res) => {
Payment.find({}).populate("student","username image gender")
.then(py=>{
    res.status(200).json(py);
})
.catch(err=>{
    res.status(500).send(err);
})
};

// createNewPayment function - To create new Payment
exports.createNewPayment = (req, res) => {
  // Convert selected date to yyyy/MM format
  const selectedDate = new Date(req.body.month);
  const month = `${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}`;

  // Create new payment with updated month
  const newPayment = new Payment({
    student: req.body.student,
    amount: req.body.amount,
    method: req.body.method,
    month: month, // Set the month property to the updated value
    ...(req.body.note && { note: req.body.note })
  });

  newPayment.save()
    .then(py => {
      res.status(201).json(py);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

exports.listPaymentbystudent = (req, res) => {
  Payment.find({student:req.params.id}).populate("student","username image gender")
  .then(py=>{
      res.status(200).json(py);
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };
