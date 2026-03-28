import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderScreen = () => {
  const { id } = useParams();
  const paymentMethod = localStorage.getItem('paymentMethod') || 'Online Payment';

  return (
    <div className="order-container">
      <div className="success-icon">
        <i className="fas fa-check-circle" style={{fontSize: '5rem', color: 'var(--success)', marginBottom: '1.5rem'}}></i>
      </div>
      <h1 className="success-msg">Order Confirmed!</h1>
      <p style={{fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem'}}>Thank you for your purchase. Your order ID is: <strong>{id}</strong></p>
      
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left', padding: '2rem' }}>
        <h2 style={{ color: 'white', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Next Steps</h2>
        {paymentMethod === 'Online Payment' ? (
           <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>We have successfully processed your online payment. You will receive an email confirmation shortly with tracking details once the item ships.</p>
        ) : (
           <p style={{fontSize: '1.1rem', lineHeight: '1.6'}}>You have selected <strong>Cash on Delivery</strong>. Please ensure you have the exact amount ready when our delivery executive arrives. You will receive an email shortly with tracking details.</p>
        )}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/" className="btn" style={{ display: 'inline-block', width: 'auto' }}>Continue Shopping</Link>
        </div>
      </div>

      <style>{`
        .order-container {
          text-align: center;
          padding: 3rem 1rem;
        }
        .success-msg {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default OrderScreen;
