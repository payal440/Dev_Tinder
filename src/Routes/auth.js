const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validateSignupData } = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("user created sucessfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("eroor saving the user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {
      // create a JWT token

      const token = await user.getJWT();

      // Add the token to cookie and send the responce back to
      res.cookie("token", token,{
        expires  : new Date(Date.now()+ 8 * 3600000)
      });
      res.send("login sucessfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token", null ,{
        expires: new Date(Date.now()),
    });
    res.send("logout sucessfully");
});

module.exports = authRouter;