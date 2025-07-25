const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/:status/:id", userAuth, async (req, res) => {
  try {
    const status = req.params.status;
    const toUserId = req.params.id;
    const allowedStatus = ["interested", "ignored"];
    const fromUserId = req.user._id;

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status");
    }
    const validatedId = await User.findById(toUserId);
    if (!validatedId) {
      throw new Error("Invalid id");
    }

    if (toUserId === String(fromUserId)) {
      throw new Error("Cant sent request to yourself");
    }
    const exist = await ConnectionRequest.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });
    if (exist) {
      return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
    }
    const connectionRequest = new ConnectionRequest({
      toUserId,
      fromUserId,
      status,
    });

    await connectionRequest.save();
    res.json({
  message: req.user.firstName + " " + status + " " + validatedId.firstName,
  data: connectionRequest
});

  } catch (error) {
    res.status(400).send(error.message);
  }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const {status, requestId} = req.params
        const allowedStatus = ['rejected', 'accepted']
        const verifiedStatus = allowedStatus.includes(status)
        if(!verifiedStatus){
            throw new Error('Status is invalid');
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: user._id,
            status: 'interested'
        })
        if(!connectionRequest){
            throw new Error('No request')
        }
        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({message: status , data})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

module.exports = requestRouter;
