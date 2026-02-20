import React from 'react';

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Campus Safe Space</h1>
        <p className="login-subtitle">Anonymous Confession Wall</p>
        <button onClick={handleGoogleLogin} className="login-button">
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
