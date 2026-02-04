import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { 
  clearErrors, 
  updateProduct, 
  getProductDetails 
} from "../../actions/productAction";
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";
import { toast } from "react-toastify";
import "./UpdateProduct.css";
import { 
  Sun, 
  Moon, 
  Package, 
  DollarSign, 
  FileText, 
  Tag, 
  Image as ImageIcon,
  Save,
  X,
  TrendingUp,
  Truck
} from 'lucide-react';

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { error, product } = useSelector((state) => state.productDetails);
  const { user } = useSelector((state) => state.user);
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.product);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  
  // New multi-vendor fields
  const [platformCommissionPercent, setPlatformCommissionPercent] = useState(10);
  const [shippingCharges, setShippingCharges] = useState(50);
  const [gstPercent, setGstPercent] = useState(18);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
    "Electronics",
    "Accessories",
    "Home & Kitchen",
    "Books",
    "Sports",
    "Toys",
    "Beauty",
    "Health",
    "Other"
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setCategory(product.category || "");
      setStock(product.stock || 0);
      setOldImages(product.images || []);
      
      // Set multi-vendor fields (with fallback to defaults)
      setPlatformCommissionPercent(product.platformCommissionPercent || 10);
      setShippingCharges(product.shippingCharges || 50);
      setGstPercent(product.gstPercent || 18);
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Product Updated Successfully");
      
      // Navigate based on user role
      if (user?.role === 'seller') {
        navigate("/seller/products");
      } else if (user?.role === 'admin') {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
      
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, error, navigate, isUpdated, id, product, updateError, user]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    
    // Add multi-vendor fields
    myForm.set("platformCommissionPercent", platformCommissionPercent);
    myForm.set("shippingCharges", shippingCharges);
    myForm.set("gstPercent", gstPercent);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(updateProduct(id, myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagesPreview(imagesPreview.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  const removeOldImage = (index) => {
    setOldImages(oldImages.filter((_, i) => i !== index));
  };

  // Calculate estimated earnings
  const calculateEarnings = () => {
    if (!price) return { total: 0, commission: 0, earnings: 0 };
    
    const itemPrice = parseFloat(price) || 0;
    const shipping = parseFloat(shippingCharges) || 0;
    const commission = (itemPrice * (parseFloat(platformCommissionPercent) || 0)) / 100;
    const gst = ((itemPrice + shipping) * (parseFloat(gstPercent) || 0)) / 100;
    const total = itemPrice + shipping + gst;
    const earnings = total - commission;
    
    return {
      total: total.toFixed(2),
      commission: commission.toFixed(2),
      earnings: earnings.toFixed(2),
      gst: gst.toFixed(2)
    };
  };

  const earnings = calculateEarnings();

  return (
    <Fragment>
      <div className="update-product-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="update-product-container">
          <div className="update-hero">
            <div className="hero-icon">
              <Package size={48} />
            </div>
            <h1 className="hero-title">Update Product</h1>
            <p className="hero-subtitle">Modify product details and inventory</p>
          </div>

          <form 
            className="update-product-form" 
            encType="multipart/form-data" 
            onSubmit={updateProductSubmitHandler}
          >
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group full-width">
                <label htmlFor="name">
                  <FileText size={18} />
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter product name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">
                  <DollarSign size={18} />
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="stock">
                  <Package size={18} />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock"
                  placeholder="Enter stock"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="description">
                  <FileText size={18} />
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  cols="30"
                  rows="4"
                />
              </div>

              {/* Category */}
              <div className="form-group full-width">
                <label htmlFor="category">
                  <Tag size={18} />
                  Category
                </label>
                <select 
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  {categories.map((cate) => (
                    <option key={cate} value={cate}>
                      {cate}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing Details Section */}
              <div className="pricing-section full-width">
                <h3 className="section-title">
                  <TrendingUp size={18} />
                  Pricing Details
                </h3>
                
                <div className="pricing-grid">
                  <div className="form-group">
                    <label htmlFor="shippingCharges">
                      <Truck size={16} />
                      Shipping Charges (₹)
                    </label>
                    <input
                      id="shippingCharges"
                      type="number"
                      value={shippingCharges}
                      onChange={(e) => setShippingCharges(e.target.value)}
                      placeholder="50"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gstPercent">
                      <FileText size={16} />
                      GST (%)
                    </label>
                    <input
                      id="gstPercent"
                      type="number"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(e.target.value)}
                      placeholder="18"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="platformCommissionPercent">
                      <TrendingUp size={16} />
                      Platform Commission (%)
                    </label>
                    <input
                      id="platformCommissionPercent"
                      type="number"
                      value={platformCommissionPercent}
                      onChange={(e) => setPlatformCommissionPercent(e.target.value)}
                      placeholder="10"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <span className="help-text">
                  Platform takes {platformCommissionPercent}% commission on product price
                </span>
              </div>

              {/* Earnings Preview */}
              {price > 0 && (
                <div className="earnings-preview full-width">
                  <h4>Estimated Breakdown (per unit)</h4>
                  <div className="earnings-grid">
                    <div className="earning-item">
                      <span className="earning-label">Product Price:</span>
                      <span className="earning-value">₹{parseFloat(price || 0).toFixed(2)}</span>
                    </div>
                    <div className="earning-item">
                      <span className="earning-label">Shipping:</span>
                      <span className="earning-value">₹{parseFloat(shippingCharges || 0).toFixed(2)}</span>
                    </div>
                    <div className="earning-item">
                      <span className="earning-label">GST ({gstPercent}%):</span>
                      <span className="earning-value">₹{earnings.gst}</span>
                    </div>
                    <div className="earning-item total">
                      <span className="earning-label">Customer Pays:</span>
                      <span className="earning-value">₹{earnings.total}</span>
                    </div>
                    <div className="earning-item commission">
                      <span className="earning-label">Platform Commission:</span>
                      <span className="earning-value">-₹{earnings.commission}</span>
                    </div>
                    <div className="earning-item seller">
                      <span className="earning-label">You Earn:</span>
                      <span className="earning-value">₹{earnings.earnings}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Upload */}
              <div className="form-group full-width">
                <label htmlFor="images">
                  <ImageIcon size={18} />
                  Product Images
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="images"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProductImagesChange}
                    multiple
                  />
                  <label htmlFor="images" className="file-upload-label">
                    <ImageIcon size={20} />
                    <span>Choose Images</span>
                  </label>
                </div>
              </div>

              {/* Old Images Preview */}
              {oldImages && oldImages.length > 0 && (
                <div className="form-group full-width">
                  <label>Current Images</label>
                  <div className="images-preview-grid">
                    {oldImages.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={image.url} alt="Old Product Preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeOldImage(index)}
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {imagesPreview.length > 0 && (
                <div className="form-group full-width">
                  <label>New Images Preview</label>
                  <div className="images-preview-grid">
                    {imagesPreview.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={image} alt="Product Preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              <Save size={20} />
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;