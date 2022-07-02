const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const logger = require("./middleware/logger");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

process.on("uncaughtException", (ex) => {
  console.log("We got an Uncaught exception");
  winston.error(ex.message);
  process.exit(1);
});

// const p = Promise.reject(new Error("Something failed during startup"));
// p.then(() => console.log("done"));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined. ");
  process.exit(1);
}

app.use(express.json());
app.use(logger);

// Setting a default PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}...`));
