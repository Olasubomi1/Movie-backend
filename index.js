const express = require("express");
const Joi = require("joi");
const app = express();
app.use(express.json());

const movies = [
  { movieGenres: ["action", "ramance", "thriller"] },
  { id: 1, genre: "action", name: "terminator" },
  { id: 2, genre: "romance", name: "love" },
  { id: 3, genre: "thriller", name: "lucy" },
];

app.get("/", (req, res) => {
  res.send("Hello World, my name is soft.");
});
// Getting the list of movies
app.get("/api/movies", (req, res) => {
  res.send(movies);
});
// Getting the list of movieGenres
app.get("/api/MovieGenres", (req, res) => {
  res.send(movies.movieGenres);
});

// Getting a movie by its id
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");
  res.send(movie);
});
// Adding a new movie to the list of movies
app.post("/api/movies", (req, res) => {
  const schema = {
    genre: Joi.string().min(4).required(),
    name: Joi.string().min(4).required(),
  };
  const result = Joi.validate(req.body, schema);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const movie = {
    id: movies.length + 1,
    name: req.body.name,
    genre: req.body.genre,
  };
  movies.push(movie);
  res.send(movie);
});
// Getting the post for a given year and month
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});
// Getting a post by a query
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.query);
});
// Updating data
app.put("/api/movies/:id", (req, res) => {
  // Look up the movie
  // If not existing, return 404
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");
  // Validate
  // If invalid, return 400 - Bad request
  const schema = {
    name: Joi.string().min(4).required(),
    genre: Joi.string().min(4),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  // Update movie
  // Return the updated movie
  movie.name = req.body.name;
  movie.genre = req.body.genre;
  res.send(movie);
});
// Deleting a movie
app.delete("/api/movies/:id", (req, res) => {
  // Look up the movie
  // If not existing, return 404
  const movie = movies.find((c) => c.id === parseInt(req.params.id));
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  // Delete
  const index = movies.indexOf(movie);
  movies.splice(index, 1);

  // Return the same movie
  res.send(movie);
});
// Setting a default PORT
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening to port ${port}...`));
