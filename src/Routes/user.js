const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl about age gender skills"; // fields to populate for user data in connection requests
// get all pending requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try{
    const loggedInUserId = req.user._id;
    const connectionrequests = await ConnectionRequest.find({
      $or : [
        {toUserId: loggedInUserId, status : "interested"},
        {fromUserId: loggedInUserId, status : "interested"},
      ],
    }).populate("fromUserId",  USER_SAFE_DATA);

    const data = connectionrequests.map((row)=> row.fromUserId);

    res.json({
      message : "Connections fetched successfully",
      data : connectionrequests,
    });
  }catch(err){  
    res.status(400).send({message : err.message}); 
  }
})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try{
    const loggedInUserId = req.user._id;
    const connectionrequests = await ConnectionRequest.find({
      $or : [
        {toUserId: loggedInUserId, status : "accepted"},
        {fromUserId: loggedInUserId, status : "accepted"},
      ],
    }).populate("fromUserId",  USER_SAFE_DATA);
    const data = connectionrequests.map((row)=> row.fromUserId);;
    res.json({data});
  }catch(err){  
    res.status(400).send({message : err.message}); 
  }
})

module.exports = userRouter;
