const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
    });

    await ConnectionRequest.find({
      $or: [{ toUserId: req.user._id }, { fromUserId: req.user._id }],
      status: "accepted",
    });
    res.json({
      messgae: "data fatched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = userRouter;
