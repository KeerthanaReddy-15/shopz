import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="form-container">
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'block' }}>Select Method</label>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="radio" 
              id="online" 
              name="paymentMethod" 
              value="Online Payment"
              checked={paymentMethod === 'Online Payment'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="online" style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>Online Payment</label>
          </div>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="radio" 
              id="cod" 
              name="paymentMethod" 
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="cod" style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>Cash on Delivery</label>
          </div>
        </div>
        <button type="submit" className="btn">Continue</button>
      </form>
    </div>
  );
};

export default PaymentScreen;
