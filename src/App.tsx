import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, logout } from './services/AuthService'; // Firebase imports
import './i18n'; // Import i18n configuration for translations
import { useTranslation } from 'react-i18next'; // Import useTranslation hook from react-i18next

import Home from './pages/Home';
import Tasks from './components/TaskManager';
import GuestList from './components/GuestaList';
import Budget from './components/Budget';
import Vendors from './components/Vendors';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Detect browser language
  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'fr', 'ro'];

    if (supportedLanguages.includes(browserLanguage)) {
      i18n.changeLanguage(browserLanguage);
    } else {
      i18n.changeLanguage('en'); // Default to English if not supported
    }
  }, [i18n]);

  // Google login handler
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
          <h2>{t('welcome')}</h2>
          <input
            type="email"
            placeholder={t('enterEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={t('enterPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-container">
            <button onClick={handleEmailLogin}>{t('loginWithEmail')}</button>
            <button onClick={handleSignUp}>{t('signUpWithEmail')}</button>
            <button onClick={handleGoogleLogin}>{t('loginWithGoogle')}</button>
          </div>
        </div>
      ) : (
        <div>
          <nav className="nav-bar">
            <Link to="/">{t('home')}</Link>
            <Link to="/tasks">{t('tasks')}</Link>
            <Link to="/guests">{t('guests')}</Link>
            <Link to="/budget">{t('budget')}</Link>
            <Link to="/vendors">{t('vendors')}</Link>
            <button onClick={handleLogout} className="logout-button">{t('logout')}</button>
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
