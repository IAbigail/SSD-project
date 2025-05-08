import React, { useState } from 'react';

import './styles/App.css';  // Correct the path to reflect the new location
//import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, logout } from './services/AuthService';
import Home from './pages/Home';
import Tasks from './components/TaskManager';
import GuestList from './components/GuestaList';
import Budget from './components/Budget';
import Vendors from './components/Vendors';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      setUser(result.user);
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const result = await loginWithEmail(email, password);
      setUser(result.user);
    } catch (error) {
      console.error('Email login failed', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const result = await signUpWithEmail(email, password);
      setUser(result.user);
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Router>
      {!user ? (
        <div className="login-container">
          <h2>Welcome to Our Wedding</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-container">
            <button onClick={handleEmailLogin}>Login with Email</button>
            <button onClick={handleSignUp}>Sign Up with Email</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
          </div>
        </div>
      ) : (
        <div>
          <nav className="nav-bar">
            <Link to="/">Home</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/guests">Guest List</Link>
            <Link to="/budget">Budget</Link>
            <Link to="/vendors">Vendors</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </nav>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/guests" element={<GuestList />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/vendors" element={<Vendors />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
