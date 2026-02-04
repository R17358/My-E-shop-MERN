import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../actions/productAction';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, FileText, Tag, Upload, Plus, TrendingUp, Truck, Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';

function Profile() {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    // New fields for multi-vendor
    const [platformCommissionPercent, setPlatformCommissionPercent] = useState('10');
    const [shippingCharges, setShippingCharges] = useState('50');
    const [gstPercent, setGstPercent] = useState('18');

    const dispatch = useDispatch();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
            setImagePreview(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('stock', stock);
        formData.append('seller', user.user_id); // Set seller field
        formData.append('user', user.user_id); // Keep for backward compatibility
        formData.append('image', image);
        
        // Add new multi-vendor fields
        formData.append('platformCommissionPercent', platformCommissionPercent);
        formData.append('shippingCharges', shippingCharges);
        formData.append('gstPercent', gstPercent);

        dispatch(createProduct(formData)).then(() => {
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setStock('');
            setImage(null);
            setImagePreview(null);
            setPlatformCommissionPercent('10');
            setShippingCharges('50');
            setGstPercent('18');
            
            toast.success('Product created successfully!');
            
            // Navigate based on user role
            if (user.role === 'seller') {
                navigate('/seller/dashboard');
            } else if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        });
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
        <div className="create-product-container">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="create-product-card">
                <div className="create-product-header">
                    <Plus size={32} className="header-icon" />
                    <h1>Create New Product</h1>
                    <p>Add a new product to your store</p>
                </div>

                <form className="create-product-form" onSubmit={handleSubmit}>
                    {/* Basic Product Info */}
                    <div className="form-group">
                        <label htmlFor="name">
                            <Package size={16} />
                            Product Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <FileText size={16} />
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter product description"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">
                                <DollarSign size={16} />
                                Price (₹)
                            </label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stock">
                                <Package size={16} />
                                Stock
                            </label>
                            <input
                                id="stock"
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">
                            <Tag size={16} />
                            Category
                        </label>
                        <input
                            id="category"
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category"
                            required
                        />
                    </div>

                    {/* New Multi-Vendor Fields */}
                    <div className="pricing-section">
                        <h3 className="section-title">
                            <TrendingUp size={18} />
                            Pricing Details
                        </h3>
                        
                        <div className="form-row">
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
                            <span className="help-text">Platform takes {platformCommissionPercent}% commission on product price</span>
                        </div>
                    </div>

                    {/* Earnings Preview */}
                    {price && (
                        <div className="earnings-preview">
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

                    {/* Image Upload */}
                    <div className="form-group">
                        <label htmlFor="image">
                            <Upload size={16} />
                            Product Image
                        </label>
                        <div className="image-upload-wrapper">
                            <input
                                id="image"
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="image-input"
                                required
                            />
                            <label htmlFor="image" className="image-upload-label">
                                {imagePreview ? (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <span className="change-image">Change Image</span>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <Upload size={32} />
                                        <span>Click to upload image</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="create-product-btn">
                        <Plus size={20} />
                        <span>Create Product</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;