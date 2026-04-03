const mongoose = require("mongoose")
const  validator = require("validator")
const jwt = require("jsonwebtoken")
const  bcrypt = require("bcrypt")
const User = require("../models/user");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required : true,
    index : true,
    minlength : 4,
    maxlength : 50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    lowercase : true,
    required: true, 
    unique : true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("invalid email address:"+  value)
      }
    }
  },
  password: { 
    type: String,
    required : true
  },
  age: {
    type: Number,
    min : 18,
  }, 
  gender:{
    type: String,
    enum: {
      values: ["male","femele","others"],
      message: "{value} is not a valid gender"
    },
    validate(value){
      if(!["male","femele","others"].includes(value)){
        throw new Error("gender data is not valid");
      }
    }
  },
  photoUrl:{
    type: String,
    default: "https://share.google/lJV2xmIjg4lkaJvR6"
  },
  about: {
    type : String,
    default : "this is a default photo"
  },
  skills : {
    type : [String],
  }
  
}, 
{
  timestamps: true,

});



userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$123",{expiresIn:"7d",
  });
 
  return token;
}
userSchema.methods.validatePassword = async function(passwordinputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordinputByUser,
    passwordHash
  );
  return isPasswordValid;
};
const Users = mongoose.model("User",userSchema)
module.exports = Users