const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const router = express.Router();

// Getting the list of genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  // console.log(genres);
  res.send(genres);
});

// Adding a new genre to the list of genres
router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    genre: req.body.genre,
  });
  await genre.save();
  // console.log(addedMovie);

  res.send(genre);
});

// Getting a genre by its id
router.get("/:id", async (req, res) => {
  let genre;
  try {
    genre = await Genre.find({ _id: req.params.id });
    console.log(genre);
  } catch (err) {
    console.log(err.message);
  }
  if (!genre) {
    console.log("no genre by given id");
    return res.status(404).send("The genre with the given ID was not found");
  }
  res.send(genre);
});

// Updating data
router.put("/:id", async (req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findOneAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      genre: req.body.genre,
    },
    { new: true }
  );
  // console.log(genre);
  // Look up the genre
  // If not existing, return 404
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");
  res.send(genre);
});
// Deleting a genre
router.delete("/:id", [auth, admin], async (req, res) => {
  // Look up the genre
  // If not existing, return 404
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  // Return the same genre
  res.send(genre);
});

module.exports = router;
