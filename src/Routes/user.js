const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

const USER_SAFE_DATA =
  "firstName lastName emailId age gender photoUrl about skills"; // fields to populate for user data in connection requests
// get all pending requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionrequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connectionrequests.map((row) => row.fromUserId);

    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionrequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId._id, status: "accepted" },
        { fromUserId: loggedInUserId._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    console.log("connectionrequests", connectionrequests);
    const data = connectionrequests.map((row) => {
      if (row.fromUserId._id.toString() == loggedInUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;
