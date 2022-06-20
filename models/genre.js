const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genre",
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

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(4).required(),
    name: Joi.string().min(4).required(),
  };
  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
