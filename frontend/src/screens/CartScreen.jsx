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
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          };

          const { data } = await axios.get(
            'https://shopz-backend.onrender.com/api/users/cart',
            config
          );

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
    const newCart = cartItems.filter(x => x._id !== id);

    setCartItems(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));

    if (userInfo) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        };

        const formattedCart = newCart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty
        }));

        await axios.put(
          'https://shopz-backend.onrender.com/api/users/cart',
          formattedCart,
          config
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          Your cart is empty <Link to="/">Go Back</Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* LEFT SIDE */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <Link to={`/product/${item._id}`}>
                    {item.name}
                  </Link>
                  <p>₹{item.price}</p>
                  <p>Qty: {item.qty}</p>
                </div>

                <button onClick={() => removeFromCartHandler(item._id)}>
                  ❌
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="cart-summary">
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            </h2>

            <p>
              ₹
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toLocaleString('en-IN')}
            </p>

            <button onClick={() => navigate('/shipping')}>
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cart-container {
          max-width: 1000px;
          margin: auto;
          padding: 20px;
          color: white;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(15, 23, 42, 0.6);
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .cart-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-info {
          flex: 1;
        }

        .cart-info a {
          color: white;
          font-weight: bold;
          text-decoration: none;
        }

        .cart-summary {
          background: rgba(15, 23, 42, 0.6);
          padding: 1.5rem;
          border-radius: 10px;
        }

        .cart-summary button {
          width: 100%;
          padding: 10px;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 8px;
          margin-top: 1rem;
          cursor: pointer;
        }

        .empty-cart {
          text-align: center;
          margin-top: 50px;
        }

        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CartScreen;