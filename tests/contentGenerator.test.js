const { generateDescription } = require('../src/services/contentGenerator');

describe('Content Generator Service', () => {
  it('should generate a description for a car', () => {
    const car = {
      make: 'Toyota',
      model: 'Corolla',
      year: 1998,
      filthScore: 35,
    };

    const description = generateDescription(car);
    
    // Check that the description contains the car details
    expect(description).toContain('1998');
    expect(description).toContain('Toyota');
    expect(description).toContain('Corolla');
    expect(description).toContain('35');
    expect(description.length).toBeGreaterThan(20);
  });

  it('should handle missing filthScore', () => {
    const car = {
      make: 'Honda',
      model: 'Civic',
      year: 2005,
    };

    const description = generateDescription(car);
    
    expect(description).toContain('2005');
    expect(description).toContain('Honda');
    expect(description).toContain('Civic');
    expect(description).toContain('unknown');
  });

  it('should return default message on error', () => {
    // Test with invalid car object to trigger error
    const invalidCar = null;
    
    const description = generateDescription(invalidCar);
    
    expect(description).toBe('No description available.');
  });
});
