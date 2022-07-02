const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/validation");
require("./startup/config")();
require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

// Setting a default PORT
const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`listening to port ${port}...`));
