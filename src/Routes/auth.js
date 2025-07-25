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
    const savedUser = await user.save();
    res.json({message:"user added", data:savedUser});
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
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
            const token = await jwt.sign({_id:user._id}, 'mangandi', {expiresIn:'1 d'})
            res.cookie('token', token)
            res.send(user)
        }else{
            throw new Error('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now())
    })
    res.send("Logout successful")
})
module.exports = authRouter