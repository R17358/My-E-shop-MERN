import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../actions/productAction';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, FileText, Tag, Upload, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

function Profile() {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const dispatch = useDispatch();

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
        formData.append('user', user.user_id);
        formData.append('image', image);

        dispatch(createProduct(formData)).then(() => {
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setStock('');
            setImage(null);
            setImagePreview(null);
            toast.success('Product created successfully!');
            if (isAuthenticated) {
                navigate('/admin');
            }
        });
    };

    return (
        <div className="create-product-container">
            <div className="create-product-card">
                <div className="create-product-header">
                    <Plus size={32} className="header-icon" />
                    <h1>Create New Product</h1>
                    <p>Add a new product to your store</p>
                </div>

                <form className="create-product-form" onSubmit={handleSubmit}>
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