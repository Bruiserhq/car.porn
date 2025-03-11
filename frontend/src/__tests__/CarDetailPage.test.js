import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import CarDetailPage from '../pages/CarDetailPage';
import { generateAffiliateLink } from '../services/affiliateService';

// Mock the affiliate service
jest.mock('../../src/services/affiliateService');

// Mock axios
jest.mock('axios');

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '123' }),
}));

describe('CarDetailPage Component', () => {
  const mockCar = {
    _id: '123',
    make: 'Toyota',
    model: 'Corolla',
    year: 1998,
    filthScore: 35,
    description: 'This is a test description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the affiliate link generation
    generateAffiliateLink.mockImplementation((car) => ({
      ebay: `https://www.ebay.com/sch/i.html?_nkw=${car.year}+${car.make}+${car.model}+parts`,
      amazon: `https://www.amazon.com/s?k=${car.year}+${car.make}+${car.model}+parts&tag=mock-tag`
    }));
  });

  test('renders loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <BrowserRouter>
        <CarDetailPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/loading car details/i)).toBeInTheDocument();
  });

  test('renders car details when data is loaded', async () => {
    axios.get.mockResolvedValue({ data: mockCar });
    
    render(
      <BrowserRouter>
        <CarDetailPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('car-details')).toBeInTheDocument();
    });
    
    expect(screen.getByText(`${mockCar.year} ${mockCar.make} ${mockCar.model}`)).toBeInTheDocument();
    expect(screen.getByText(`Make: ${mockCar.make}`)).toBeInTheDocument();
    expect(screen.getByText(`Model: ${mockCar.model}`)).toBeInTheDocument();
    expect(screen.getByText(`Year: ${mockCar.year}`)).toBeInTheDocument();
    expect(screen.getByText(/filth score:/i)).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText(mockCar.description)).toBeInTheDocument();
    
    // Check for affiliate links
    expect(screen.getByTestId('ebay-link')).toBeInTheDocument();
    expect(screen.getByTestId('amazon-link')).toBeInTheDocument();
    expect(screen.getByText('Find parts on eBay')).toBeInTheDocument();
    expect(screen.getByText('Shop on Amazon')).toBeInTheDocument();
    
    // Check for ad container
    expect(screen.getByTestId('detail-ad')).toBeInTheDocument();
    expect(screen.getByText('Advertisement')).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <CarDetailPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch car details/i)).toBeInTheDocument();
    });
  });
});
