import React, { Fragment, useEffect, useState } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
} from "../../actions/productAction.js";
import { addItemsToCart } from "../../actions/cartAction.js";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Package, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const increaseQuantity = () => {
    if (product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    toast.success("Added to cart!");
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error]);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product._id]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Fragment>
      <div className="product-details-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="product-details-page">
          <div className="product-image-section">
            {product.images && product.images.length > 0 ? (
              <div className="image-carousel">
                {/* Main Image Display */}
                <div className="main-image-container">
                  <img
                    src={product.images[currentImageIndex]?.url}
                    alt={`${product.name} ${currentImageIndex + 1}`}
                    className="main-image"
                  />
                  
                  {/* Navigation Arrows (only show if multiple images) */}
                  {product.images.length > 1 && (
                    <>
                      <button 
                        className="carousel-btn prev-btn" 
                        onClick={prevImage}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        className="carousel-btn next-btn" 
                        onClick={nextImage}
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product.images.length > 1 && (
                    <div className="image-counter">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Navigation (only show if multiple images) */}
                {product.images.length > 1 && (
                  <div className="thumbnail-container">
                    {product.images.map((item, index) => (
                      <div
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => goToImage(index)}
                      >
                        <img src={item.url} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image">
                <Package size={64} />
                <p>No image available</p>
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <span className="product-id">Product #{product._id}</span>
            </div>

            <div className="price-section">
              <span className="currency">₹</span>
              <span className="price">{product.price}</span>
            </div>

            <div className="stock-section">
              <Package size={18} />
              <span className="stock-label">Availability:</span>
              <span className={`stock-status ${product.stock < 1 ? 'out-of-stock' : 'in-stock'}`}>
                {product.stock < 1 ? 'Out of Stock' : 'In Stock'}
              </span>
            </div>

            <div className="quantity-section">
              <label>Quantity</label>
              <div className="quantity-controls">
                <button 
                  className="qty-btn" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                  className="qty-input"
                />
                <button 
                  className="qty-btn" 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button
              className="add-to-cart-btn"
              disabled={product.stock < 1}
              onClick={addToCartHandler}
            >
              <ShoppingCart size={20} />
              <span>{product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            <div className="description-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDetails;