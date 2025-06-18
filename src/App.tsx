import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail, signUpWithEmail, logout } from './services/AuthService';
import './i18n';
import { useTranslation } from 'react-i18next';

import Home from './pages/Home';
import Tasks from './components/TaskManager';
import GuestList from './components/GuestaList';
import Budget from './components/Budget';
import Vendors from './components/Vendors';
import GuestUpload from './components/GuestUpload'; 

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'fr', 'ro'];
    i18n.changeLanguage(supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en');
  }, [i18n]);

  useEffect(() => {
    checkFirebaseUserSession().then(setUser);
  }, []);

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      }
      const result = await loginWithEmail(email, password);
      setUser(result.user);
    } catch (error) {
      console.error(isSignUp ? 'Signup failed' : 'Login failed', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <Router>
      {!user ? (
        <div className="login-container">
          <h2>{t(isSignUp ? 'signUp' : 'login')}</h2>
          <input type="email" placeholder={t('enterEmail')} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder={t('enterPassword')} value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="button-container">
            <button onClick={handleAuth}>{t(isSignUp ? 'signUp' : 'login')}</button>
            <button onClick={() => setIsSignUp(!isSignUp)}>{t(isSignUp ? 'alreadyHaveAccount' : 'createAccount')}</button>
            <button onClick={loginWithGoogle}>{t('loginWithGoogle')}</button>
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
              <Route path="/guestupload" element={<GuestUpload />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
};

const checkFirebaseUserSession = async () => null;

export default App;
