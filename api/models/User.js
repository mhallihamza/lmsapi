'use strict';
// Import mongoose
    const mongoose = require("mongoose");

// Declare schema and assign Schema class
    const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
    const User = new Schema({
        username: {
            type:String,
            required:true,
            unique:true
        },
        email: {
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        createdOn: {
            type:Date,
            default:Date.now
        }
    });

// create and export model
module.exports = mongoose.model("User", User);