const express = require("express");
const { userAuth } = require("../middlewares/auth");
const user = require("../models/user");
const profileRouters = express.Router();
const { validateProfileEditData } = require("../utils/validation");

profileRouters.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouters.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("invalid edit request");
    }

    const loggedINUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedINUser[key] = req.body[key]));
    await loggedINUser.save();

    res.send(`${loggedINUser.firstName},your profile updated sucessfully`);
    
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = profileRouters;
