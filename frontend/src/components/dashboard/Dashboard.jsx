import React, { useEffect } from 'react'
import ProductRow from './ProductRow'
import {useDispatch, useSelector} from "react-redux"
import { getAdminProduct } from '../../actions/productAction';
import { deleteProduct } from '../../actions/productAction';
import './Dashboard.css'
import { Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {

  const dispatch = useDispatch()
  const {user} = useSelector((state)=>state.user)
  
  useEffect(() => {
    if(user && user.user_id) {
      dispatch(getAdminProduct(user.user_id)); 
    }
  }, [dispatch, user]);

  const deleteProductFunc = (id) => {
    dispatch(deleteProduct(id));
  };

  const {products = []} = useSelector((state)=>state.products);
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <Package size={32} />
          <div>
            <h1>My Products</h1>
            <p>{products.length} products in your store</p>
          </div>
        </div>
        <Link to="/newproduct" className="create-product-link">
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="products-list">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductRow 
              key={product._id} 
              product={product} 
              onDelete={deleteProductFunc}
            />
          ))
        ) : (
          <div className="no-products-dashboard">
            <Package size={48} />
            <h3>No Products Yet</h3>
            <p>Start by creating your first product</p>
            <Link to="/admin/create" className="create-first-btn">
              <Plus size={18} />
              <span>Create Product</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard