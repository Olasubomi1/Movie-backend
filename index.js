const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const logger = require("./middleware/logger");
const home = require("./routes/home");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const customers = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/moviebackend")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("could not connect to mongodb...", err));

app.use(express.json());
app.use(logger);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

app.use("/", home);

// Setting a default PORT
const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`listening to port ${port}...`));
