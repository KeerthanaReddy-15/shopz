import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    setLoading(true);
    setError('');
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post('https://shopz-backend.onrender.com/api/users/register', { name, email, password }, config);
        // Prevent auto-login by not storing userInfo right away
        // localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.href = '/login';
    } catch (err) {
        setLoading(false);
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="form-container" style={{maxWidth: '450px'}}>
      <h1>Register Account</h1>
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" style={{marginTop: '1rem'}} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="register-link" style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>
        Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: '600'}}>Login Here</Link>
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
      `}</style>
    </div>
  );
};

export default RegisterScreen;
