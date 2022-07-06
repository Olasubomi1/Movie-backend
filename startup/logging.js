const winston = require("winston");
// require("winston-mongodb");
const logger = require("../middleware/logger");
require("express-async-errors");
const express = require("express");
const app = express();

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    console.log("We got an unhandled rejection");
    throw ex;
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://localhost/moviebackend",
  //   })
  // );

  app.use(logger);
};
