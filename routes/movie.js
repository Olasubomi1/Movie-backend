const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    genre: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  })
);
// Getting the list of movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  console.log(movies);
  res.send(movies);
});

// Adding a new movie to the list of movies
router.post("/", async (req, res) => {
  const schema = {
    genre: Joi.string().min(4).required(),
    name: Joi.string().min(4).required(),
  };
  const result = Joi.validate(req.body, schema);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const movie = new Movie({
    name: req.body.name,
    genre: req.body.genre,
  });
  const addedMovie = await movie.save();
  console.log(addedMovie);

  res.send(addedMovie);
});

// Getting a movie by its id
router.get("/:id", async (req, res) => {
  let movie;
  try {
    movie = await Movie.find({ _id: req.params.id });
    console.log(movie);
  } catch (err) {
    console.log(err.message);
  }
  if (!movie) {
    console.log("no movie by given id");
    return res.status(404).send("The movie with the given ID was not found");
  }
  res.send(movie);
});

// Updating data
router.put("/:id", async (req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const schema = {
    name: Joi.string().min(4).required(),
    genre: Joi.string().min(4),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const movie = await Movie.findOneAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      genre: req.body.genre,
    },
    { new: true }
  );
  // console.log(movie);
  // Look up the movie
  // If not existing, return 404
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});
// Deleting a movie
router.delete("/:id", async (req, res) => {
  // Look up the movie
  // If not existing, return 404
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  // Return the same movie
  res.send(movie);
});

module.exports = router;
