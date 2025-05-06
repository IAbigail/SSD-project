import React, { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from './AuthService';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setErrorMessage("Google Login failed. Please try again.");
      console.error("Google Login Error:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      setErrorMessage("Email Login failed. Please check your credentials.");
      console.error("Email Login Error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <button onClick={handleGoogleLogin}>Login with Google</button>

      <div>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
          required
        />
        <button 
          onClick={handleEmailLogin} 
          disabled={!email || !password}  // Disable if email or password is empty
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
