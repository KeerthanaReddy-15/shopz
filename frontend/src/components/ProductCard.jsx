import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="img-container">
          <img src={product.image} alt={product.name} />
          <div className="overlay">View Details</div>
        </div>
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="reviews">({product.numReviews} reviews)</span>
        </div>
        <div className="card-footer">
          <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          <button className="add-btn" onClick={(e) => {
             e.preventDefault();
             const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
             const existItem = cart.find(x => x._id === product._id);
             if(existItem) {
               localStorage.setItem('cartItems', JSON.stringify(cart.map(x => x._id === existItem._id ? {...existItem, qty: existItem.qty + 1} : x)));
             } else {
               localStorage.setItem('cartItems', JSON.stringify([...cart, {...product, qty: 1}]));
             }
             alert('Added to cart!');
          }}>+</button>
        </div>
      </div>
      <style>{`
        .product-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          backdrop-filter: var(--glass-backdrop);
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .img-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }
        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .img-container:hover img {
          transform: scale(1.1);
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(99, 102, 241, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .img-container:hover .overlay {
          opacity: 1;
        }
        .card-body {
          padding: 1.5rem;
        }
        .product-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rating {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .stars {
          color: #fbbf24;
          letter-spacing: 2px;
          margin-right: 0.5rem;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .price {
          font-size: 1.4rem;
          font-weight: 800;
          color: white;
        }
        .add-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s, transform 0.2s;
        }
        .add-btn:hover {
          background: var(--primary-hover);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
