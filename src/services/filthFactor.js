/**
 * Calculate the filth factor for a car based on its data
 * @param {Object} carData - The car data object
 * @returns {Number} - The calculated filth score
 */
function calculateFilthFactor(carData) {
  // Base filth factor is 10 for newer cars, 30 for older cars
  const baseScore = carData.year < 2000 ? 30 : 10;

  // Add a constant for demonstration (5)
  return baseScore + 5;
}

module.exports = { calculateFilthFactor };
