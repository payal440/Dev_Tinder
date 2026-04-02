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
    // ✅ check body
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Request body is empty");
    }

    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedINUser = req.user;

    const allowedUpdates = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
      "skills",
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        loggedINUser[key] = req.body[key];
      }
    });

    await loggedINUser.save();

    res.send(`${loggedINUser.firstName}, your profile updated successfully`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouters;
