/**
 * Content Generator Service
 * Generates descriptive content for cars
 */

/**
 * Generate a description for a car
 * @param {Object} car - The car object
 * @returns {String} - Generated description
 */
function generateDescription(car) {
  try {
    // In a real implementation, this might call an AI service
    // For now, we'll use a simple template
    const adjectives = [
      'remarkable',
      'stunning',
      'classic',
      'elegant',
      'powerful',
      'iconic',
      'impressive',
    ];
    
    // Pick a random adjective
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    // Generate a simple description
    return `The ${car.year} ${car.make} ${car.model} is truly a ${randomAdjective} vehicle. ` +
           `With a filth score of ${car.filthScore || 'unknown'}, it's a must-see for collectors.`;
  } catch (error) {
    console.error('Error generating description:', error);
    return 'No description available.';
  }
}

module.exports = { generateDescription };
