/**
 * Affiliate Service
 * Generates affiliate links for cars
 */

/**
 * Generate an affiliate link for a car
 * @param {Object} car - The car object
 * @returns {Object} - Object containing affiliate links
 */
function generateAffiliateLink(car) {
  if (!car || !car.make || !car.model || !car.year) {
    return {
      ebay: '#',
      amazon: '#'
    };
  }

  // Format the search query
  const searchQuery = `${car.year}+${car.make}+${car.model}+parts`;
  
  // Mock affiliate links
  // In a real implementation, these would include affiliate IDs
  return {
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}&_sacat=0`,
    amazon: `https://www.amazon.com/s?k=${searchQuery}&tag=carfilthscore-20`
  };
}

export { generateAffiliateLink };
