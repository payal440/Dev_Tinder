const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", // reference to the User collection
        required : true,
    },
    
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        enum : {
        values:["pending","interested","accepted","rejected"],
        message : `{value} is incorrect status type`,
        },
    },
},
{
    timestamps : true,
});

//ConnectionRequest.find({fromUserId: "123", toUserId: "456"})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true }); // ✅ FIXED - add unique index

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);