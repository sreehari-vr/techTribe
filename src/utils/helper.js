const validator = require("validator");
const User = require("../models/user")

async function signUpValidation(req) {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName) {
    throw new Error("First name is empty");
  }
  if (!lastName) {
    throw new Error("Last name is empty");
  }
  const emailVal = validator.isEmail(email);
  if (!emailVal) {
    throw new Error("Invalid email");
  }
  const passVal = validator.isStrongPassword(password);
  if (!passVal) {
    throw new Error("Invalid password");
  }
  const emailExist = await User.findOne({email})
  if(emailExist){
    throw new Error('Email exist')
  }
}

module.exports = {
  signUpValidation,
};
