import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  const paymentMethod = localStorage.getItem('paymentMethod') || 'Online Payment';

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 150;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const placeOrderHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.post('http://localhost:5000/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      }, config);
      
      localStorage.removeItem('cartItems');
      try {
        await axios.put('http://localhost:5000/api/users/cart', [], config);
      } catch(e) { console.error('Failed to clear cart in backend', e) }
      
      navigate(`/order/${data.orderId}`);
    } catch (error) {
       console.error(error);
       alert(error.response && error.response.data.message ? error.response.data.message : 'Failed to place order');
    }
  };

  return (
    <div className="placeorder-grid">
      <div className="order-details">
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2>Shipping</h2>
          <p>
            <strong>Address: </strong> 
            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
        </div>

        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2>Payment Method</h2>
          <p><strong>Method: </strong> {paymentMethod}</p>
        </div>

        <div className="glass-card">
          <h2>Order Items</h2>
          {cartItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }}>
               <img src={item.image} alt={item.name} style={{ width: '50px', borderRadius: '5px' }} />
               <Link to={`/product/${item.product || item._id}`} style={{ flex: 2 }}>{item.name}</Link>
               <div style={{ flex: 1 }}>{item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary glass-card">
        <h2>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span>Items</span>
          <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span>Shipping</span>
          <span>₹{shippingPrice.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <span>Tax (18%)</span>
          <span>₹{taxPrice.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          <span>Total</span>
          <span>₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
        <button type="button" className="btn" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }} onClick={placeOrderHandler}>
          Place Order
        </button>
      </div>

      <style>{`
        h2 { font-size: 1.8rem; margin-bottom: 1.5rem; color: white; }
        .placeorder-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
           .placeorder-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default PlaceOrderScreen;
