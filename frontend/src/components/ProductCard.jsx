import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductCard = ({ product }) => {

  const addToCartHandler = async () => {

    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];

    const existItem = cart.find(x => x._id === product._id);

    let newCart;

    if (existItem) {
      newCart = cart.map(x =>
        x._id === product._id
          ? { ...x, qty: x.qty + 1 }
          : x
      );
    } else {
      newCart = [
        ...cart,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1
        }
      ];
    }

    localStorage.setItem('cartItems', JSON.stringify(newCart));

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

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
      } catch (e) {
        console.error(e);
      }
    }

    alert('Added to cart!');
  };

  return (
    <div className="product-card">

      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="card-body">
        <h3>{product.name}</h3>
        <p>₹{product.price}</p>

        <button className="add-btn" onClick={addToCartHandler}>
          +
        </button>
      </div>

      <style>{`
        .product-card {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 12px;
          position: relative;
        }

        .product-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
        }

        .card-body {
          margin-top: 10px;
        }

        .add-btn {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          font-size: 18px;
          cursor: pointer;
        }
      `}</style>

    </div>
  );
};

export default ProductCard;