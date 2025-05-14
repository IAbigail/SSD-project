// Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the navigate hook
import { loginWithEmail, loginWithGoogle, signUpWithEmail } from '../services/AuthService'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      setErrorMessage("Google Login failed. Please try again.");
      console.error("Google Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage("Email Login failed. Please check your credentials.");
      console.error("Email Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage("Email Sign Up failed. Please try again.");
      console.error("Email Sign Up Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigate('/signup');  // This will navigate to the SignUp page
  };

  return (
    <div>
      <h2>Login or Sign Up</h2>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login with Google'}
      </button>

      <form onSubmit={handleEmailLogin}>
        <div>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
            required 
          />
        </div>
        <div>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <button onClick={navigateToSignUp}>Sign Up with Email</button> {/* Button to go to SignUp page */}
    </div>
  );
};

export default Login;
