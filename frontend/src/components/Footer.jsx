import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} ShopZ E-Commerce. All rights reserved.</p>
      </div>
      <style>{`
        footer {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-muted);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 3rem;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
