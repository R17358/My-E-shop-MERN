import React from 'react'
import './ProductRow.css'
import { Link } from 'react-router-dom';

function ProductRow({ product, onDelete }) {

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            onDelete(product._id); // Call the onDelete function with the product ID
        }
    };

    return (
        <div className='mainContain'>
            <div className="rowContainer">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexGrow: 1 }}>
                    <div className="row">
                        <div className="id">
                            <p>#{product._id}</p>
                        </div>
                        <div className="other">
                            <div className="title">
                                <h4>{product.name}</h4>
                            </div>
                            <div className="price">
                                <h5>PRICE: {product.price}/-</h5>
                            </div>
                            <div className="price">
                                <h5>STOCK: {product.stock}</h5>
                            </div>
                            <div className="price">
                                <h5>CATEGORY: {product.category}</h5>
                            </div>
                        </div>
                    </div>
                </Link>
                {/* Separate DELETE button */}
                <div className="delete">
                    <button onClick={handleDelete}>DELETE</button>
                </div>
            </div>
        </div>
    );
}

export default ProductRow;
