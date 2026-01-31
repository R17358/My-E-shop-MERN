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
  X
} from 'lucide-react';

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { error, product } = useSelector((state) => state.productDetails);
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
    } else {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setOldImages(product.images);
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
      navigate("/dashboard");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, error, navigate, isUpdated, id, product, updateError]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

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