const winston = require("winston");
const mongoose = require("mongoose");
const { level } = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/moviebackend", { useUnifiedTopology: true })
    .then(() =>
      winston.info({ message: "Connected to MongoDB.......", level: "info" })
    );
};
