const { timeStamp } = require("console");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  photoUrl:{
    type: String,
    default: 'https://cdn.vectorstock.com/i/2000v/72/80/elegant-girl-profile-portrait-vector-19257280.avif'
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['M','F','O'],
    required: true
  },
  about: {
    type: String,
  },
  skills: {
    type: [String],
    required: true
  },
},{timestamps:true});

module.exports = mongoose.model('User', userSchema) //Passing Model name and Schema name thereby creating a model and exports it