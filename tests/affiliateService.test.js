const { generateAffiliateLink } = require('../src/services/affiliateService');

describe('Affiliate Service', () => {
  it('should generate correct affiliate links for a car', () => {
    const car = {
      make: 'Toyota',
      model: 'Corolla',
      year: 1998,
    };

    const links = generateAffiliateLink(car);
    
    // Check that the links contain the expected search parameters
    expect(links.ebay).toContain('1998+Toyota+Corolla+parts');
    expect(links.amazon).toContain('1998+Toyota+Corolla+parts');
    
    // Check that the links point to the correct domains
    expect(links.ebay).toContain('ebay.com');
    expect(links.amazon).toContain('amazon.com');
    
    // Check that the Amazon link includes an affiliate tag
    expect(links.amazon).toContain('tag=carfilthscore-20');
  });

  it('should handle missing car data', () => {
    const links = generateAffiliateLink(null);
    
    // Should return placeholder links
    expect(links.ebay).toBe('#');
    expect(links.amazon).toBe('#');
  });

  it('should handle partial car data', () => {
    const car = {
      make: 'Toyota',
      // Missing model and year
    };

    const links = generateAffiliateLink(car);
    
    // Should return placeholder links
    expect(links.ebay).toBe('#');
    expect(links.amazon).toBe('#');
  });
});
