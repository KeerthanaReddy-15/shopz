import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password }, config);
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.href = '/';
    } catch (err) {
        setLoading(false);
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Sign In</h1>
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="register-link">
        New Customer? <Link to="/register">Register Here</Link>
      </div>
      <style>{`
        .error-alert {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .register-link {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-muted);
        }
        .register-link a {
          color: var(--primary);
          font-weight: 600;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
