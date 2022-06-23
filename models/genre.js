const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
    min: 5,
    max: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(4).required(),
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
