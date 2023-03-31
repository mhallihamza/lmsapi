'use strict'

const  express = require("express");
const  bodyParser = require("body-parser");
const cors = require('cors');
const authRoutes = require('./api/routes/authRoutes')
const routes = require('./api/routes/userRoutes');
const cookieParser = require('cookie-parser');
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
routes(app);
app.use('',authRoutes);
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