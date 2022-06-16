const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
      required: true,
      minlength: 5,
      maxlength: 15,
    },
    __v: {
      type: Number,
      default: 0,
    },
  })
);
// Getting the list of customer
router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  //   console.log(customer);
  res.send(customer);
});

// Adding a new customer to the list of customers
router.post("/", async (req, res) => {
  const schema = {
    phone: Joi.number().min(5).required(),
    name: Joi.string().min(4).required(),
  };
  const result = Joi.validate(req.body, schema);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
  });
  const addedCustomer = await customer.save();
  console.log(addedCustomer);

  res.send(addedCustomer);
});

// Getting a customer by its id
router.get("/:id", async (req, res) => {
  let customer;
  try {
    customer = await Customer.find({ _id: req.params.id });
    console.log(customer);
  } catch (err) {
    console.log(err.message);
  }
  if (!customer) {
    console.log("no customer by given id");
    return res.status(404).send("The customer with the given ID was not found");
  }
  res.send(customer);
});

// Updating data
router.put("/:id", async (req, res) => {
  // Validate
  // If invalid, return 400 - Bad request
  const schema = {
    name: Joi.string().min(5).required(),
    phone: Joi.string().min(5),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const customer = await Customer.findOneAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );
  // console.log(customer);
  // Look up the customer
  // If not existing, return 404
  if (!customer)
    return res.status(404).send("The customer with the given ID was not found");
  res.send(customer);
});
// Deleting a customer
router.delete("/:id", async (req, res) => {
  // Look up the customer
  // If not existing, return 404
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(404).send("The customer with the given ID was not found");

  // Return the same customer
  res.send(customer);
});

module.exports = router;
