import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartScreen = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchCart = async () => {
      if (userInfo) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/users/cart', config);
          setCartItems(data);
          localStorage.setItem('cartItems', JSON.stringify(data));
        } catch (error) {
          console.error(error);
        }
      } else {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
      }
    };
    fetchCart();
  }, []);

  const removeFromCartHandler = async (id) => {
    const newCart = cartItems.filter(x => (x.product || x._id) !== id);
    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
    if (userInfo) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put('http://localhost:5000/api/users/cart', newCart, config);
      } catch (error) { console.error(error); }
    }
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart glass-card">
          Your cart is empty <Link to="/">Go Back</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.product || item._id} className="cart-item glass-card">
                <img src={item.image} alt={item.name} className="cart-img" />
                <Link to={`/product/${item.product || item._id}`} className="cart-name">{item.name}</Link>
                <div className="cart-price">₹{item.price.toLocaleString('en-IN')}</div>
                <div className="cart-qty">Qty: {item.qty}</div>
                <button type="button" className="btn-remove" onClick={() => removeFromCartHandler(item.product || item._id)}>
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary glass-card">
            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
            <div className="total-price">
              ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}
            </div>
            <button type="button" className="btn btn-checkout" disabled={cartItems.length === 0} onClick={checkoutHandler}>
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cart-page h1 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          font-weight: 800;
        }
        .empty-cart {
          padding: 2rem;
          text-align: center;
          font-size: 1.2rem;
        }
        .empty-cart a {
          color: var(--primary);
          text-decoration: underline;
        }
        .cart-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          padding: 1rem;
        }
        .cart-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }
        .cart-name {
          flex: 2;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .cart-price {
          flex: 1;
          font-weight: bold;
          font-size: 1.2rem;
          color: var(--success);
        }
        .cart-qty {
          flex: 1;
        }
        .btn-remove {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          transition: background 0.3s;
        }
        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.4);
        }
        .cart-summary {
          align-self: start;
        }
        .cart-summary h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 1rem;
        }
        .total-price {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 1.5rem 0;
          color: white;
        }
        .btn-checkout {
          font-size: 1.1rem;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
        }
        .btn-checkout:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};

export default CartScreen;
