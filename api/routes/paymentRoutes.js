const express = require('express');
const router = express.Router();
const Payment = require('../controllers/paymentController.js');
router.post("",Payment.createNewPayment);
router.get("",Payment.listAllPayment);
module.exports = router;