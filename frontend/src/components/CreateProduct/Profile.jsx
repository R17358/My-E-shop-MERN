import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../actions/productAction';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(1);
    const [image, setImage] = useState(null); // State for image

    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result); // Set the base64 string
        };

        if (file) {
            reader.readAsDataURL(file); // Read the file as a data URL
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
        formData.append('image', image); // Base64 string

        // Dispatch action and handle success
        dispatch(createProduct(formData)).then(() => {
            // Clear form after submission
            setName('');
            setDescription('');
            setPrice(0);
            setCategory('');
            setStock(1);
            setImage(null);
            // Navigate only if authenticated
            if (isAuthenticated) {
                navigate('/admin');
            }
        });
    };

    return (
        <div className="mainContainer">
            <div className="container2">
                <h1>Create Product</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Product Name"
                        required
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Product Description"
                        required
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        required
                    />
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        required
                    />
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Stock"
                        required
                    />
                    <input id="file"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
