const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { editProfileValidation } = require("../utils/helper");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.send(user);
    } else {
      res.send("no user");
    }
  } catch (error) {
    res.send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    editProfileValidation(req);
    const data = req.body;
    const user = req.user;
    if (!user) {
      throw new Error("no user found");
    }
    if (!data) {
      throw new Error("no user found");
    }
    Object.keys(data).forEach((key)=>user[key]=data[key])
    await user.save()
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const data = req.body;
    const passHash = req.user.password;
    const verified = await bcrypt.compare(data.oldPassword, passHash)
    if(!verified){
        throw new Error('Password is not correct')
    }
    const newPass = await bcrypt.hash(data.newPassword, 10)
    req.user.password=newPass
    await req.user.save()
    res.send('password changed')
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
