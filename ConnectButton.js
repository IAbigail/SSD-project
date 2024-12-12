import React from "react";

// Handler functions
const handleEmailLogin = () => {
  console.log("Email login clicked");
};

const handleSignUp = () => {
  console.log("Sign up clicked");
};

const handleGoogleLogin = () => {
  console.log("Google login clicked");
};

const handleConnect = () => {
  console.log("Connect button clicked");
};

const ConnectButton = () => {
  return (
    <div className="button-container">
      <button onClick={handleEmailLogin}>Login with Email</button>
      <button onClick={handleSignUp}>Sign Up with Email</button>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default ConnectButton;
