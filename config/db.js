// Export mongoose and dotenv
const  mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//Assign MongoDB connection string to Uri and declare options settings
var  URI = process.env.MONGO;

// Declare a variable named option and assign optional settings
const  options = {
useNewUrlParser:  true,
useUnifiedTopology:  true
};

// Connect MongoDB Atlas using mongoose connect method
mongoose.connect(URI, options).then(() => {
console.log("Database connection established!");
},
err  => {
{
console.log("Error connecting Database instance due to:", err);
}
});