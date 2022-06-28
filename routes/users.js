const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movie = await User.find().sort("name").select("name email");
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
