const mongoose = require("mongoose");
const logger = require("./middleware/logger");
const home = require("./routes/home");
const movies = require("./routes/movie");
const customers = require("./routes/customers");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/moviebackend")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("could not connect to mongodb...", err));

app.use(express.json());
app.use(logger);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/", home);

// Setting a default PORT
const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`listening to port ${port}...`));
