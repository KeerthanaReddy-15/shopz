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

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = queryKeyword
          ? `https://shopz-backend.onrender.com/api/products?keyword=${queryKeyword}`
          : 'https://shopz-backend.onrender.com/api/products';

        const { data } = await axios.get(url);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [queryKeyword]);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(keyword ? `/?keyword=${keyword}` : '/');
  };

  return (
    <>
      <div className="home-header">
        <h1 className="title">
          {userInfo ? `Welcome back, ${userInfo.name}!` : 'Latest Products'}
        </h1>

        <form onSubmit={submitSearch} className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
      ) : products.length === 0 ? (
        <h3 style={{ textAlign: 'center' }}>
          No products found for "{queryKeyword}"
        </h3>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      <style>{`

        /* HEADER */
        .home-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        /* TITLE */
        .title {
          font-size: 2rem;
          font-weight: bold;
          color: white;
        }

        /* SEARCH BOX */
        .search-box {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 5px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* INPUT */
        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          padding: 10px 15px;
          width: 250px;
          font-size: 1rem;
        }

        /* BUTTON */
        .search-box button {
          background: #3b82f6;
          border: none;
          color: white;
          padding: 8px 14px;
          border-radius: 50px;
          cursor: pointer;
        }

        /* HOVER EFFECT */
        .search-box:hover {
          box-shadow: 0 0 10px rgba(59,130,246,0.5);
        }

        /* GRID */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .search-box input {
            width: 150px;
          }
        }

      `}</style>
    </>
  );
};

export default HomeScreen;