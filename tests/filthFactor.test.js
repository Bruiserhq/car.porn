const { calculateFilthFactor } = require('../src/services/filthFactor');

describe('Filth Factor Calculation', () => {
  it('should return higher score for cars older than 2000', () => {
    const oldCar = { year: 1995 };
    const newCar = { year: 2020 };
    
    const oldCarScore = calculateFilthFactor(oldCar);
    const newCarScore = calculateFilthFactor(newCar);
    
    expect(oldCarScore).toBe(35); // 30 + 5
    expect(newCarScore).toBe(15); // 10 + 5
    expect(oldCarScore).toBeGreaterThan(newCarScore);
  });
  
  it('should return 35 for cars from 1999', () => {
    const car = { year: 1999 };
    expect(calculateFilthFactor(car)).toBe(35);
  });
  
  it('should return 15 for cars from 2000', () => {
    const car = { year: 2000 };
    expect(calculateFilthFactor(car)).toBe(15);
  });
});
