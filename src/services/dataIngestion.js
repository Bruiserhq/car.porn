const fs = require('fs');
const path = require('path');
const Car = require('../models/car');
const { calculateFilthFactor } = require('./filthFactor');
const { generateDescription } = require('./contentGenerator');

/**
 * Ingest mock car data from JSON file into the database
 * @returns {Promise<Object>} Result object with counts of processed and skipped items
 */
async function ingestMockData() {
  try {
    // Read the mock data file
    const mockDataPath = path.join(__dirname, '../../mockData.json');
    const rawData = fs.readFileSync(mockDataPath, 'utf8');
    const carsData = JSON.parse(rawData);

    const result = {
      processed: 0,
      skipped: 0,
    };

    // Process each car in the mock data
    for (const carData of carsData) {
      // Check if car already exists (make + model + year combination)
      const existingCar = await Car.findOne({
        make: carData.make,
        model: carData.model,
        year: carData.year,
      });

      // Skip if car already exists
      if (existingCar) {
        result.skipped++;
        continue;
      }

      // Calculate filth score using the existing service
      const filthScore = calculateFilthFactor(carData);

      // Create the new car
      const car = new Car({
        make: carData.make,
        model: carData.model,
        year: carData.year,
        filthScore: filthScore,
      });

      // Generate description
      try {
        car.description = generateDescription(car);
      } catch (error) {
        car.description = 'No description available.';
      }

      await car.save();
      result.processed++;
    }

    return result;
  } catch (error) {
    throw new Error(`Error ingesting mock data: ${error.message}`);
  }
}

module.exports = { ingestMockData };
const fs = require('fs');
const path = require('path');
const Car = require('../models/car');
const { calculateFilthFactor } = require('./filthFactor');
const { generateDescription } = require('./contentGenerator');

// Simple in-memory cache
const cache = {
  data: null,
  timestamp: null,
  ttl: 60 * 60 * 1000, // 1 hour in milliseconds
  isValid() {
    return this.data && this.timestamp && (Date.now() - this.timestamp < this.ttl);
  },
  set(data) {
    this.data = data;
    this.timestamp = Date.now();
    return data;
  },
  clear() {
    this.data = null;
    this.timestamp = null;
  }
};

/**
 * Ingest mock car data from JSON file into the database
 * @param {Boolean} useCache - Whether to use cached data if available
 * @returns {Promise<Object>} Result object with counts of processed and skipped items
 */
async function ingestMockData(useCache = true) {
  // Check cache if enabled
  if (useCache && cache.isValid()) {
    console.log('Using cached data for ingestion');
    return cache.data;
  }

  try {
    // Read the mock data file
    const mockDataPath = path.join(__dirname, '../../mockData.json');
    const rawData = fs.readFileSync(mockDataPath, 'utf8');
    const carsData = JSON.parse(rawData);

    const result = {
      processed: 0,
      skipped: 0,
    };

    // Process each car in the mock data
    for (const carData of carsData) {
      // Check if car already exists (make + model + year combination)
      const existingCar = await Car.findOne({
        make: carData.make,
        model: carData.model,
        year: carData.year,
      });

      // Skip if car already exists
      if (existingCar) {
        result.skipped++;
        continue;
      }

      // Calculate filth score using the existing service
      const filthScore = calculateFilthFactor(carData);

      // Create the new car
      const car = new Car({
        make: carData.make,
        model: carData.model,
        year: carData.year,
        filthScore: filthScore,
      });

      // Generate description
      try {
        car.description = generateDescription(car);
      } catch (error) {
        car.description = 'No description available.';
      }

      await car.save();
      result.processed++;
    }

    // Cache the result
    return cache.set(result);
  } catch (error) {
    throw new Error(`Error ingesting mock data: ${error.message}`);
  }
}

/**
 * Clear the ingestion cache
 */
function clearCache() {
  cache.clear();
}

module.exports = { 
  ingestMockData,
  clearCache
};
