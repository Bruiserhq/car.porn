import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const [featuredCar, setFeaturedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCar = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/cars/featured');
        setFeaturedCar(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch featured car. Please try again later.');
        console.error('Error fetching featured car:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCar();
  }, []);

  if (loading) {
    return <div className="loading">Loading featured car...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!featuredCar) {
    return <div>No featured car available at this time.</div>;
  }

  return (
    <div>
      <h2>Featured Car</h2>
      <div className="car-card" data-testid="featured-car">
        <h3 className="car-title">
          {featuredCar.year} {featuredCar.make} {featuredCar.model}
        </h3>
        <p className="car-detail">
          Filth Score: <span className="filth-score">{featuredCar.filthScore}</span>
        </p>
        <p className="car-description">{featuredCar.description}</p>
        <Link to={`/cars/${featuredCar._id}`}>View Details</Link>
      </div>
    </div>
  );
}

export default HomePage;
