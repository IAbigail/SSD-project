import React, { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from '../services/AuthService';


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error: any) {
      setErrorMessage("Email Login failed. Please check your credentials.");
      console.error("Email Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      <button onClick={handleGoogleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login with Google'}
      </button>

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
          disabled={loading || !email || !password}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
