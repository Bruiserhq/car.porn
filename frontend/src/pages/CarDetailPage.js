import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/cars/${id}`);
        setCar(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch car details. Please try again later.');
        console.error('Error fetching car details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!car) {
    return <div>Car not found.</div>;
  }

  return (
    <div>
      <h2>Car Details</h2>
      <div className="car-card" data-testid="car-details">
        <h3 className="car-title">
          {car.year} {car.make} {car.model}
        </h3>
        <p className="car-detail">Make: {car.make}</p>
        <p className="car-detail">Model: {car.model}</p>
        <p className="car-detail">Year: {car.year}</p>
        <p className="car-detail">
          Filth Score: <span className="filth-score">{car.filthScore}</span>
        </p>
        <div className="car-description">
          <h4>Description:</h4>
          <p>{car.description}</p>
        </div>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

export default CarDetailPage;
