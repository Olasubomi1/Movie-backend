const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password.");

  res.send(true);
});

function validate(req) {
  const schema = {
    name: Joi.string().min(3).max(50),
    email: Joi.string().min(5).email(),
    password: Joi.string().min(8).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
