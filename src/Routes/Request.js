const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const Users = require("../models/user");

requestRouter.post(
  "/request/send/:status/:ToUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.ToUserId;
      const status = req.params.status.toLowerCase().trim();

      const allowedStatus = ["pending", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status value" + status });
      }
      const toUser = await Users.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .json({ message: "User not found with id: " + toUserId });
      }

      // if there is an existing connection request between the same users, then we will update the status of that request instead of creating a new one
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      // ✅ FIXED
      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already exists between these users",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      return res.json({
        message: `${req.user.firstName} ${req.user.lastName} has sent a ${status} connection request to ${toUser.firstName}`,
        data, // ✅ include saved data
      });
    } catch (err) {
      console.error("Error occurred while sending connection request:", err);
      return res
        .status(400)
        .send("Error occurred while sending connection request");
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user;
      const {status, requestId} = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "invalid status not allowed"})
      }

      const connectionRequest = await ConnectionRequest.findOne({_id : requestId, toUserId : loggedInUserId._id,
        status : "interested",
      });

      if(!connectionRequest){
        return res.status(404).json({message : "connection request not found with id:"+ requestId});
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      return res.json({message : " connection request updated successfully " + status, data});
    } catch (err) {
      res.status(400).send("error:" + err.message);
    }
  },
);
module.exports = requestRouter;
