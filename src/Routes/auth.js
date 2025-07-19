const express = require('express')
const authRouter = express.Router()
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require('jsonwebtoken')
const { signUpValidation } = require("../utils/helper");


authRouter.post("/signUp", async (req, res) => {
  //CREATING A NEW INSTANCE OF USER MODEL
  try {
    console.log(req.body)
    await signUpValidation(req);
    const { firstName, lastName, email, password, age, gender, skills, about } = req.body;
    const encryptedPass = await bcrypt.hash(password,10)
    console.log(encryptedPass)
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptedPass,
      age,
      gender,
      skills,
      about
    });
    await user.save();
    res.send("user saved");
  } catch (error) {
    res.send(error.message);
    console.error(error.message);
  }
})

authRouter.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            throw new Error('Invalid Credentials')
        }
        const decryptedPass = await bcrypt.compare(password, user.password)
        if(decryptedPass){
            const token = await jwt.sign({_id:user._id}, 'mangandi')
            res.cookie('token',token)
            res.send('logged in')
        }else{
            throw new Error('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = authRouter