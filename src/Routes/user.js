const express = require("express");
const { userAuth } = require("../middleware/auth");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "skills",
      "about",
      "photoUrl",
    ]);
    
    res.json({ message: "data fetched successfully", data: requests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await ConnectionRequest.find({
      $or: [{ toUserId: user._id, status: "accepted" }, { fromUserId: user._id, status: "accepted" }]
      
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "skills",
        "about",
        "photoUrl",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "skills",
        "about",
        "photoUrl",
      ]);
    const requestedUsers = requests.map((x) => {
  if (x.fromUserId._id.toString() === user._id.toString()) {
    return x.toUserId; // return the other person
  } else {
    return x.fromUserId;
  }
});
    res.json({ message: "data fetched successfully", data: requestedUsers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page-1)*limit;
    limit = limit>10?10:limit

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: user._id }, { fromUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    }).select("firstName lastName age skills about photoUrl gender")
    .skip(skip)
    .limit(limit)

    res.json({data:users});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
