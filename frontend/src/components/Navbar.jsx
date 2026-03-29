import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="container nav-container">
        
        {/* LOGO */}
        <Link to="/" className="brand">
          <span className="brand-icon">🛍️</span> ShopZ
        </Link>

        {/* NAV LINKS */}
        <nav className="nav-links">
          <Link to="/cart" className="nav-link">
            🛒 Cart
          </Link>

          {userInfo ? (
            <>
              <Link to="/wishlist" className="nav-link">
                ❤️ Wishlist
              </Link>

              <Link to="/profile" className="nav-link">
                👤 {userInfo.name}
              </Link>

              <button onClick={logoutHandler} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="signin-btn"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>

      {/* CSS */}
      <style>{`
        .navbar-header {
          background: #0f172a;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: sticky;
          top: 0;
          z-index: 999;
          padding: 0.8rem 0;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .brand {
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .brand-icon {
          font-size: 1.8rem;
        }

        .nav-links {
          display: flex;
          gap: 1.2rem;
          align-items: center;
        }

        .nav-link {
          color: #e5e7eb;
          font-weight: 500;
          text-decoration: none;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #3b82f6;
        }

        /* SIGN IN BUTTON */
        .signin-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .signin-btn:hover {
          background: #2563eb;
        }

        /* LOGOUT BUTTON */
        .logout-btn {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
        }
      `}</style>
    </header>
  );
};

export default Navbar;