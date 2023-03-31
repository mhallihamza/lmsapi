'use strict';
// Import mongoose
    const mongoose = require("mongoose");

// Declare schema and assign Schema class
    const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
    const Teacher = new Schema({
        FirstName: {
            type:String,
            required:true,
        },
        LastName: {
            type:String,
            required:true,
        },
        Email:{
            type:String,
            required:true,
        },
        Phone:{
            type:Number,
            required:true,
        },
        Address:{
            type:String,
            required:true,
        },
        Gender:{
            type:String,
            required:true,
        },
        DateBirth:{
            type:Date,
            required:true,
        },
        Images:{
            type:String
        },
        createdOn: {
            type:Date,
            default:Date.now
        }
    });

// create and export model
module.exports = mongoose.model("Teachers", Teacher);