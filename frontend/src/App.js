import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Car Filth Score App</h1>
          <nav className="nav-links">
            <Link to="/">Home</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
          </Routes>
        </main>
        
        <footer>
          <p>&copy; 2025 Car Filth Score App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
