import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // ✅ correct place

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'https://shopz-backend.onrender.com/api/users/login',
        { email, password }
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/'); // ✅ correct
    } catch (err) {
      console.error(err);
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
