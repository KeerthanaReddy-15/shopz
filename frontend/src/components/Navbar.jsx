import React from 'react';
import { Link,useNavigate} from 'react-router-dom';

const Navbar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate =useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">🛍️</span> ShopZ
        </Link>
        <nav className="nav-links">
          <Link to="/cart" className="nav-link">
            Shopping Cart
          </Link>
          {userInfo ? (
            <>
              <Link to="/wishlist" className="nav-link">
                Wishlist
              </Link>
              <Link to="/profile" className="nav-link">
                Profile ({userInfo.name})
              </Link>
              <button onClick={logoutHandler} className="nav-link btn-logout" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
               Sign In
            </Link>
          )}
        </nav>
      </div>
      <style>{`
        .navbar-header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 1rem 0;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: tracking;
        }
        .brand-icon {
          font-size: 1.8rem;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .nav-link {
          color: var(--text-main);
          font-weight: 500;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: var(--primary);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
