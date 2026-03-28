import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryKeyword = searchParams.get('keyword') || '';

  // Mock User Session for demonstration
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProducts = async () => {
  try {
    const url = queryKeyword 
      ? `https://shopz-backend.onrender.com/api/products?keyword=${queryKeyword}`
      : `https://shopz-backend.onrender.com/api/products`;

    const { data } = await axios.get(url);
    setProducts(data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching products', error);
    setLoading(false);
  }
};
    fetchProducts();
  }, [queryKeyword]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <div className="home-header">
        <h1 className="page-title">
          {userInfo ? `Welcome back, ${userInfo.name}!` : 'Latest Products'}
        </h1>
        
        <form onSubmit={submitSearch} className="search-box">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : products.length === 0 ? (
        <h3 style={{textAlign: 'center', marginTop: '3rem'}}>No products found matching "{queryKeyword}"</h3>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <style>{`
        .home-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          margin: 0;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--card-border);
          border-radius: 50px;
          overflow: hidden;
          padding: 0.3rem 0.5rem;
        }
        .search-box input {
          background: transparent;
          border: none;
          padding: 0.6rem 1rem;
          color: white;
          font-size: 1rem;
          outline: none;
          width: 250px;
        }
        .search-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: background 0.3s;
        }
        .search-btn:hover {
          background: var(--primary-hover);
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
      `}</style>
    </>
  );
};

export default HomeScreen;
