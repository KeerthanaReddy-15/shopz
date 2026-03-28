import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).address : '');
  const [city, setCity] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).city : '');
  const [postalCode, setPostalCode] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).postalCode : '');
  const [country, setCountry] = useState(localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')).country : '');

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="form-container">
      <h1>Shipping Address</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Address</label>
          <input type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <button type="submit" className="btn" style={{marginTop: '1rem'}}>Continue to Payment</button>
      </form>
    </div>
  );
};

export default ShippingScreen;
