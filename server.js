'use strict'

const  express = require("express");
const  bodyParser = require("body-parser");
const cors = require('cors');
const { Server } = require("socket.io");
const authRoutes = require('./api/routes/authRoutes')
const examRoutes = require('./api/routes/examRoutes')
const exerciceRoutes = require('./api/routes/exerciceRoutes')
const classRoutes = require('./api/routes/classRoutes')
const attendanceRoutes = require('./api/routes/attendanceRoutes');
const noteRoutes = require('./api/routes/noteRoutes')
const notificationRoutes = require('./api/routes/notificationRoutes')
const scheduleRoutes = require('./api/routes/scheduleRoutes')
const courseRoutes = require('./api/routes/courseRoutes')
const paymentRoutes = require('./api/routes/paymentRoutes')
const routes = require('./api/routes/userRoutes');
const cookieParser = require('cookie-parser');
const upload = require('./api/routes/upload');
const path = require('path');
require('dotenv').config()
// Import DB Connection
require("./config/db");

// create express app
const  app = express();

// define port to run express app
const  PORT = process.env.PORT;
// use bodyParser and middlewares on express app
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cors());
app.use('',upload)
app.use(express.static(path.join(__dirname,"./api/images")))
routes(app);
app.use('',authRoutes);
app.use('/exam',examRoutes);
app.use('/exercice',exerciceRoutes);
app.use('/class',classRoutes);
app.use('/attendance',attendanceRoutes);
app.use('/note',noteRoutes);
app.use('/notification',notificationRoutes);
app.use('/schedule',scheduleRoutes);
app.use('/course',courseRoutes);
app.use('/payment',paymentRoutes);
// Add endpoint
app.get('/', (req, res) => {
res.send("Hello World");
});

app.use((err, req, res, next) => {
    console.error(err); // log the error to the console
  
    if (res.headersSent) {
      // if headers have already been sent, just pass the error to the next middleware
      return next(err);
    }
  
    res.status(500).json({ message: 'Something went wrong' });
  });
  
// Listen to server
app.listen(PORT, () => {

console.log(`Server running at http://localhost:${PORT}`);
});