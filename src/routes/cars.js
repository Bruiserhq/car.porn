const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const { calculateFilthFactor } = require('../services/filthFactor');

// GET all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new car
router.post('/', async (req, res) => {
  // Calculate filth score if not provided
  const filthScore = req.body.filthScore !== undefined 
    ? req.body.filthScore 
    : calculateFilthFactor(req.body);

  const car = new Car({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    filthScore: filthScore
  });

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
