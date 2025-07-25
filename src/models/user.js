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
    default: 'https://i.pinimg.com/736x/16/3c/d3/163cd3adf4e0090bc60f98ebd9d9f475.jpg'
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