import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!userInfo) {
       navigate('/login');
    } else {
       setName(userInfo.name);
       setEmail(userInfo.email);
       const fetchOrders = async () => {
         try {
           const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
           const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
           setOrders(data);
         } catch(e) { console.error(e) }
       };
       fetchOrders();
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    setLoading(true);
    setError('');
    try {
        const config = { 
            headers: { 
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userInfo.token
            } 
        };
        const { data } = await axios.put('http://localhost:5000/api/users/profile', { id: userInfo._id, name, email, password }, config);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        setPassword('');
        setConfirmPassword('');
        alert('Profile Updated Successfully!');
    } catch (err) {
        setLoading(false);
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    }
  };

  return (
    <div className="profile-grid">
      <div className="form-container">
        <h2>User Profile</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter new password (optional)" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn" disabled={loading}>
             {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>

      <div className="orders-container">
        <h2>My Orders</h2>
        <div className="glass-card">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center'}}>No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderId || order._id.substring(0, 10)}</td>
                    <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                    <td>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                    <td>{order.isPaid ? <i className="fas fa-check" style={{ color: 'green' }}></i> : <i className="fas fa-times" style={{ color: 'red' }}></i>}</td>
                    <td>{order.isDelivered ? <i className="fas fa-check" style={{ color: 'green' }}></i> : <i className="fas fa-times" style={{ color: 'red' }}></i>}</td>
                    <td><button className="btn-details" onClick={() => navigate(`/order/${order._id}`)}>Details</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
        .form-container {
          margin: 0;
          width: 100%;
          max-width: 100%;
        }
        .orders-container h2 {
          font-size: 1.8rem;
          margin-bottom: 2rem;
          font-weight: 700;
        }
        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }
        .orders-table th, .orders-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--card-border);
        }
        .orders-table th { color: var(--text-muted); font-size: 0.9rem; }
        .btn-details {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }
        .btn-details:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ProfileScreen;
