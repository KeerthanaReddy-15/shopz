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
        const { data } = await axios.get(
          `https://shopz-backend.onrender.com/api/products/${id}`
        );
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader"></div>;

  return (
    <>
      <Link className="go-back" to="/">← Go Back</Link>

      <div className="product-layout">

        {/* IMAGE */}
        <div className="product-image">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400";
            }}
          />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h2>{product.name}</h2>

          <div className="price">
            ₹{product.price?.toLocaleString('en-IN')}
          </div>

          <p>{product.description}</p>

          {/* STOCK FIX */}
          <div>
            {Number(product.countInStock) === 0 ? (
              <span className="out-of-stock">Out of Stock</span>
            ) : (
              <span className="in-stock">In Stock ({product.countInStock})</span>
            )}
          </div>

          {/* BUTTONS */}
          <div className="btn-group">

            {/* ADD TO CART */}
            <button
              className="btn-add"
              disabled={product.countInStock === 0}
              onClick={async () => {
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
                    alert('Cart sync failed');
                  }
                }

                alert('Added to cart!');
              }}
            >
              Add To Cart
            </button>

            {/* WISHLIST */}
            <button
              className="btn-light"
              onClick={async () => {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));

                if (!userInfo) {
                  alert('Please login');
                  return;
                }

                try {
                  const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                  };

                  const { data: currentWishlist } = await axios.get(
                    'https://shopz-backend.onrender.com/api/users/wishlist',
                    config
                  );

                  const wishlistIds = currentWishlist
                    ? currentWishlist.map(p =>
                        typeof p === 'object' ? p._id : p
                      )
                    : [];

                  if (!wishlistIds.includes(product._id)) {
                    wishlistIds.push(product._id);

                    await axios.put(
                      'https://shopz-backend.onrender.com/api/users/wishlist',
                      wishlistIds,
                      config
                    );

                    alert('Added to wishlist');
                  } else {
                    alert('Already in wishlist');
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              ❤️ Wishlist
            </button>

          </div>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .go-back {
          display: inline-block;
          margin-bottom: 20px;
          color: white;
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: rgba(15, 23, 42, 0.6);
          padding: 2rem;
          border-radius: 20px;
        }

        .product-image img {
          width: 100%;
          max-height: 400px;
          object-fit: contain;
          border-radius: 10px;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          color: white;
        }

        .price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #10b981;
        }

        .in-stock {
          color: #22c55e;
        }

        .out-of-stock {
          color: red;
        }

        .btn-group {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-add {
          background: #22c55e;
          color: white;
          padding: 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .btn-light {
          background: #3b82f6;
          color: white;
          padding: 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ProductScreen;