const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const data = await jwt.verify(cookies.token, "mangandi");
    if (!data) {
      return res.status(401).send('Please login');
    }
    const user = await User.findById(data._id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.send(error.message)
  }
};

module.exports = {
  userAuth,
};
