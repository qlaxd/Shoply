import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login', { replace: true }); // replace: true azt jelenti, hogy a login oldalra navigálás után a history stack-ből eltávolítjuk a home oldalt ezáltal nem tudunk vissza a home oldalra navigálni a back gombbal   
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>Bevásárlás</h1>
        <button onClick={handleLogout} className="logout-button">
          Kijelentkezés
        </button>
      </nav>
      <div className="content">
        <p>Ez lesz majd a főoldal.</p>
      </div>
    </div>
  );
};

export default Home;
