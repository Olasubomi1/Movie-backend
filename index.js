const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
// require("./startup/logging")();

// Setting a default PORT
const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  winston.info(`listening to port ${port}...`)
);

module.exports = server;
