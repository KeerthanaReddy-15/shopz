import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product', error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader"></div>;

  return (
    <>
      <Link className="btn btn-light my-3 go-back" to="/">
        &larr; Go Back
      </Link>
      <div className="product-layout">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h2 className="title">{product.name}</h2>
          <div className="rating">
             <span className="stars">{'★'.repeat(Math.round(product.rating || 0))}</span>
             <span>({product.numReviews} reviews)</span>
          </div>
          <div className="price">₹{product.price?.toLocaleString('en-IN')}</div>
          <p className="description">{product.description}</p>
          <div className="status">
             Status: {product.countInStock > 0 ? <span className="in-stock">In Stock ({product.countInStock})</span> : <span className="out-of-stock">Out of Stock</span>}
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn btn-add" disabled={product.countInStock === 0} onClick={async () => {
              const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
              // Use product or _id to find existing items safely across both Mongoose and localStorage formats
              const existItemId = product._id;
              const existItem = cart.find(x => (x.product || x._id) === existItemId);
              let newCart;
              if (existItem) {
                newCart = cart.map(x => (x.product || x._id) === existItemId ? { ...x, qty: x.qty + 1 } : x);
              } else {
                newCart = [...cart, { product: product._id, name: product.name, image: product.image, price: product.price, qty: 1 }];
              }
              localStorage.setItem('cartItems', JSON.stringify(newCart));
              
              const userInfo = JSON.parse(localStorage.getItem('userInfo'));
              if(userInfo) {
                try {
                  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                  await axios.put('http://localhost:5000/api/users/cart', newCart, config);
                } catch(e) { 
                  console.error(e);
                  alert(e.response?.data?.message || 'Failed to sync cart to server');
                  return;
                }
              }
              alert('Added to cart!');
            }}>
              Add To Cart
            </button>
            <button className="btn btn-light" onClick={async () => {
              const userInfo = JSON.parse(localStorage.getItem('userInfo'));
              if (!userInfo) {
                alert('Please sign in to add to wishlist');
                return;
              }
              try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // Fetch current wishlist
                const { data: currentWishlist } = await axios.get('http://localhost:5000/api/users/wishlist', config);
                const wishlistIds = currentWishlist ? currentWishlist.filter(p => p).map(p => typeof p === 'object' ? p._id : p) : [];
                if(!wishlistIds.includes(product._id)) {
                  wishlistIds.push(product._id);
                  await axios.put('http://localhost:5000/api/users/wishlist', wishlistIds, config);
                  alert('Added to wishlist!');
                } else {
                  alert('Already in wishlist!');
                }
              } catch(e) { 
                console.error(e);
                alert(e.response?.data?.message || e.message || 'Error adding to wishlist');
              }
            }}>
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .go-back {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 2rem;
          transition: background 0.3s;
        }
        .go-back:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          background: var(--card-bg);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: var(--glass-shadow);
          backdrop-filter: var(--glass-backdrop);
          border: 1px solid var(--card-border);
        }
        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }
        }
        .product-image img {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          transition: transform 0.3s ease;
        }
        .product-image img:hover {
          transform: scale(1.02);
        }
        .product-info .title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 800;
          color: white;
        }
        .product-info .price {
          font-size: 2rem;
          color: white;
          font-weight: 700;
          margin: 1.5rem 0;
          background: linear-gradient(135deg, #10b981, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .description {
          line-height: 1.8;
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .status {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }
        .in-stock { color: var(--success); font-weight: 600; }
        .out-of-stock { color: var(--danger); font-weight: 600; }
        .btn-add {
          font-size: 1.2rem;
          padding: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .btn-add:disabled {
          background: #475569;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default ProductScreen;
