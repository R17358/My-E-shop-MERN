import React from 'react'
import './ProductRow.css'
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Eye, DollarSign, Package, Tag, Edit } from 'lucide-react';

function ProductRow({ product, onDelete }) {
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            onDelete(product._id);
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/admin/product/${product._id}`);
    };

    return (
        <div className='product-row-card'>
            <Link to={`/product/${product._id}`} className="product-row-link">
                <div className="product-row-image">
                    {product.images && product.images[0] ? (
                        <img src={product.images[0].url} alt={product.name} />
                    ) : (
                        <Package size={32} />
                    )}
                </div>

                <div className="product-row-details">
                    <div className="product-row-main">
                        <h3 className="product-row-name">{product.name}</h3>
                        <span className="product-row-id">#{product._id}</span>
                    </div>

                    <div className="product-row-meta">
                        <div className="meta-item">
                            <DollarSign size={16} />
                            <span>₹{product.price}</span>
                        </div>
                        <div className="meta-item">
                            <Package size={16} />
                            <span>Stock: {product.stock}</span>
                        </div>
                        <div className="meta-item">
                            <Tag size={16} />
                            <span>{product.category}</span>
                        </div>
                    </div>
                </div>

                <div className="product-row-actions">
                    <button className="view-btn" title="View Product">
                        <Eye size={18} />
                    </button>
                    <button 
                        className="edit-btn" 
                        onClick={handleEdit}
                        title="Edit Product"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                        className="delete-btn" 
                        onClick={handleDelete}
                        title="Delete Product"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </Link>
        </div>
    );
}

export default ProductRow;