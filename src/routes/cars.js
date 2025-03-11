const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const { calculateFilthFactor } = require('../services/filthFactor');
const { generateDescription } = require('../services/contentGenerator');

// GET all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new car
router.post('/', async (req, res) => {
  // Calculate filth score if not provided
  const filthScore =
    req.body.filthScore !== undefined ? req.body.filthScore : calculateFilthFactor(req.body);

  // Create car object
  const car = new Car({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    filthScore: filthScore,
  });

  // Generate description
  try {
    car.description = generateDescription(car);
  } catch (error) {
    car.description = 'No description available.';
  }

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET featured car
router.get('/featured', async (req, res) => {
  try {
    // For now, just return the first car in the database
    const featuredCar = await Car.findOne();
    
    if (!featuredCar) {
      return res.status(404).json({ message: 'No featured car found' });
    }
    
    res.status(200).json(featuredCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
