const fs = require('fs');
const path = require('path');
const { ingestMockData } = require('../src/services/dataIngestion');
const Car = require('../src/models/car');
const { calculateFilthFactor } = require('../src/services/filthFactor');
const { generateDescription } = require('../src/services/contentGenerator');

// Mock the dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('../src/models/car');
jest.mock('../src/services/filthFactor');
jest.mock('../src/services/contentGenerator');

describe('Data Ingestion Service', () => {
  // Sample mock data for testing
  const mockCarsData = [
    { make: 'Toyota', model: 'Corolla', year: 1998 },
    { make: 'Honda', model: 'Civic', year: 2005 },
    { make: 'Ford', model: 'Mustang', year: 2020 },
    { make: 'Toyota', model: 'Corolla', year: 1998 }, // Duplicate to test skipping
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock the file system operations
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCarsData));
    path.join.mockReturnValue('/mocked/path/to/mockData.json');

    // Mock the filth factor calculation
    calculateFilthFactor.mockImplementation((car) => {
      return car.year < 2000 ? 35 : 15;
    });

    // Mock the description generation
    generateDescription.mockImplementation((car) => {
      return `Mock description for ${car.year} ${car.make} ${car.model}`;
    });

    // Mock Car.findOne to simulate checking for duplicates
    Car.findOne.mockImplementation(async (query) => {
      // For testing, only return a match for the duplicate Toyota Corolla 1998
      // on the second occurrence
      if (
        query.make === 'Toyota' &&
        query.model === 'Corolla' &&
        query.year === 1998 &&
        Car.findOne.mock.calls.filter(
          (call) =>
            call[0].make === 'Toyota' && call[0].model === 'Corolla' && call[0].year === 1998
        ).length > 1
      ) {
        return { make: 'Toyota', model: 'Corolla', year: 1998 };
      }
      return null;
    });

    // Mock Car.prototype.save
    Car.prototype.save = jest.fn().mockResolvedValue(true);
  });

  it('should ingest cars and calculate filth scores', async () => {
    const result = await ingestMockData();

    // Should process 3 cars and skip 1 duplicate
    expect(result.processed).toBe(3);
    expect(result.skipped).toBe(1);

    // Verify Car.findOne was called 4 times (once for each car in mock data)
    expect(Car.findOne).toHaveBeenCalledTimes(4);

    // Verify calculateFilthFactor was called 3 times (for each unique car)
    expect(calculateFilthFactor).toHaveBeenCalledTimes(3);
    
    // Verify generateDescription was called 3 times (for each unique car)
    expect(generateDescription).toHaveBeenCalledTimes(3);

    // Verify Car constructor was called 3 times with correct data
    expect(Car).toHaveBeenCalledTimes(3);
    expect(Car).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Corolla',
      year: 1998,
      filthScore: 35,
    });
    expect(Car).toHaveBeenCalledWith({
      make: 'Honda',
      model: 'Civic',
      year: 2005,
      filthScore: 15,
    });
    expect(Car).toHaveBeenCalledWith({
      make: 'Ford',
      model: 'Mustang',
      year: 2020,
      filthScore: 15,
    });

    // Verify save was called 3 times
    expect(Car.prototype.save).toHaveBeenCalledTimes(3);
  });

  it('should handle errors during ingestion', async () => {
    // Mock readFileSync to throw an error
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    await expect(ingestMockData()).rejects.toThrow('Error ingesting mock data: File not found');
  });
});
const fs = require('fs');
const path = require('path');
const { ingestMockData, clearCache } = require('../src/services/dataIngestion');
const Car = require('../src/models/car');
const { calculateFilthFactor } = require('../src/services/filthFactor');
const { generateDescription } = require('../src/services/contentGenerator');

// Mock the dependencies
jest.mock('fs');
jest.mock('path');
jest.mock('../src/models/car');
jest.mock('../src/services/filthFactor');
jest.mock('../src/services/contentGenerator');

describe('Data Ingestion Service', () => {
  // Sample mock data for testing
  const mockCarsData = [
    { make: 'Toyota', model: 'Corolla', year: 1998 },
    { make: 'Honda', model: 'Civic', year: 2005 },
    { make: 'Ford', model: 'Mustang', year: 2020 },
    { make: 'Toyota', model: 'Corolla', year: 1998 }, // Duplicate to test skipping
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock the file system operations
    fs.readFileSync.mockReturnValue(JSON.stringify(mockCarsData));
    path.join.mockReturnValue('/mocked/path/to/mockData.json');

    // Mock the filth factor calculation
    calculateFilthFactor.mockImplementation((car) => {
      return car.year < 2000 ? 35 : 15;
    });

    // Mock the description generation
    generateDescription.mockImplementation((car) => {
      return `Mock description for ${car.year} ${car.make} ${car.model}`;
    });

    // Mock Car.findOne to simulate checking for duplicates
    Car.findOne.mockImplementation(async (query) => {
      // For testing, only return a match for the duplicate Toyota Corolla 1998
      // on the second occurrence
      if (
        query.make === 'Toyota' &&
        query.model === 'Corolla' &&
        query.year === 1998 &&
        Car.findOne.mock.calls.filter(
          (call) =>
            call[0].make === 'Toyota' && call[0].model === 'Corolla' && call[0].year === 1998
        ).length > 1
      ) {
        return { make: 'Toyota', model: 'Corolla', year: 1998 };
      }
      return null;
    });

    // Mock Car.prototype.save
    Car.prototype.save = jest.fn().mockResolvedValue(true);
  });

  it('should ingest cars and calculate filth scores', async () => {
    const result = await ingestMockData(false); // Disable cache for this test

    // Should process 3 cars and skip 1 duplicate
    expect(result.processed).toBe(3);
    expect(result.skipped).toBe(1);

    // Verify Car.findOne was called 4 times (once for each car in mock data)
    expect(Car.findOne).toHaveBeenCalledTimes(4);

    // Verify calculateFilthFactor was called 3 times (for each unique car)
    expect(calculateFilthFactor).toHaveBeenCalledTimes(3);
    
    // Verify generateDescription was called 3 times (for each unique car)
    expect(generateDescription).toHaveBeenCalledTimes(3);

    // Verify Car constructor was called 3 times with correct data
    expect(Car).toHaveBeenCalledTimes(3);
    expect(Car).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Corolla',
      year: 1998,
      filthScore: 35,
    });
    expect(Car).toHaveBeenCalledWith({
      make: 'Honda',
      model: 'Civic',
      year: 2005,
      filthScore: 15,
    });
    expect(Car).toHaveBeenCalledWith({
      make: 'Ford',
      model: 'Mustang',
      year: 2020,
      filthScore: 15,
    });

    // Verify save was called 3 times
    expect(Car.prototype.save).toHaveBeenCalledTimes(3);
  });

  it('should handle errors during ingestion', async () => {
    // Mock readFileSync to throw an error
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    await expect(ingestMockData()).rejects.toThrow('Error ingesting mock data: File not found');
  });

  it('should use cache when available and requested', async () => {
    // First call to populate cache
    await ingestMockData(true);
    
    // Reset mocks to verify they're not called again
    jest.clearAllMocks();
    
    // Second call should use cache
    const result = await ingestMockData(true);
    
    // Verify that file reading and database operations weren't performed
    expect(fs.readFileSync).not.toHaveBeenCalled();
    expect(Car.findOne).not.toHaveBeenCalled();
    expect(Car).not.toHaveBeenCalled();
    expect(Car.prototype.save).not.toHaveBeenCalled();
    
    // Verify we got a result from cache
    expect(result).toBeDefined();
    expect(result).toHaveProperty('processed');
    expect(result).toHaveProperty('skipped');
  });

  it('should bypass cache when requested', async () => {
    // First call to populate cache
    await ingestMockData(true);
    
    // Reset mocks to verify they're called again
    jest.clearAllMocks();
    
    // Second call with useCache=false should bypass cache
    await ingestMockData(false);
    
    // Verify that operations were performed again
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(Car.findOne).toHaveBeenCalled();
  });

  it('should clear cache when requested', async () => {
    // First call to populate cache
    await ingestMockData(true);
    
    // Clear cache
    clearCache();
    
    // Reset mocks to verify they're called again
    jest.clearAllMocks();
    
    // Next call should repopulate cache
    await ingestMockData(true);
    
    // Verify that operations were performed again
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(Car.findOne).toHaveBeenCalled();
  });
});
