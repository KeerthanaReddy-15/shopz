import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=wishlist');
    } else {
      const fetchWishlist = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('https://shopz-backend.onrender.com/api/users/wishlist', config);
          setWishlistItems(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      fetchWishlist();
    }
  }, [navigate]);

  const removeFromWishlistHandler = async (id) => {
    const newWishlist = wishlistItems.filter(x => x._id !== id);
    setWishlistItems(newWishlist);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put('https://shopz-backend.onrender.com/api/users/wishlist', newWishlist.map(w => w._id), config);
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="cart-page">
      <h1>My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="empty-cart glass-card">
          Your wishlist is empty <Link to="/">Go Back</Link>
        </div>
      ) : (
        <div className="cart-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="cart-items">
            {wishlistItems.map(item => (
              <div key={item._id} className="cart-item glass-card" style={{display: 'flex', gap: '1.5rem', padding: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                <img src={item.image} alt={item.name} style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}} />
                <Link to={`/product/${item._id}`} style={{flex: 2, fontSize: '1.2rem', fontWeight: 600, color: 'white'}}>{item.name}</Link>
                <div style={{flex: 1, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--success)'}}>₹{item.price.toLocaleString('en-IN')}</div>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button type="button" className="btn btn-add" onClick={async () => {
                        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                        const existItemId = item.product || item._id;
                        const existItem = cart.find(x => (x.product || x._id) === existItemId);
                        let newCart;
                        if(existItem) {
                          newCart = cart.map(x => (x.product || x._id) === existItemId ? {...x, qty: x.qty + 1} : x);
                        } else {
                          newCart = [...cart, { product: existItemId, name: item.name, image: item.image, price: item.price, qty: 1 }];
                        }
                        localStorage.setItem('cartItems', JSON.stringify(newCart));
                        try {
                           const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                           await axios.put('https://shopz-backend.onrender.com/api/users/cart', newCart, config);
                           alert('Added to cart!');
                        } catch(e) { 
                           console.error(e); 
                           alert(e.response?.data?.message || 'Failed to sync cart to server');
                        }
                  }} style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}>
                    Add To Cart
                  </button>
                  <button type="button" className="btn-remove" onClick={() => removeFromWishlistHandler(item._id)} style={{background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600}}>
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;
