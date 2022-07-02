const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World, my name is soft.");
});

module.exports = router;
