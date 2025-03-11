import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../pages/HomePage';

// Mock axios
jest.mock('axios');

describe('HomePage Component', () => {
  const mockFeaturedCar = {
    _id: '123',
    make: 'Toyota',
    model: 'Corolla',
    year: 1998,
    filthScore: 35,
    description: 'This is a test description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/loading featured car/i)).toBeInTheDocument();
  });

  test('renders featured car when data is loaded', async () => {
    axios.get.mockResolvedValue({ data: mockFeaturedCar });
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('featured-car')).toBeInTheDocument();
    });
    
    expect(screen.getByText(`${mockFeaturedCar.year} ${mockFeaturedCar.make} ${mockFeaturedCar.model}`)).toBeInTheDocument();
    expect(screen.getByText(/filth score:/i)).toBeInTheDocument();
    expect(screen.getByText(mockFeaturedCar.description)).toBeInTheDocument();
    
    // Check for ad container
    expect(screen.getByTestId('home-ad')).toBeInTheDocument();
    expect(screen.getByText('Advertisement')).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch featured car/i)).toBeInTheDocument();
    });
  });
});
