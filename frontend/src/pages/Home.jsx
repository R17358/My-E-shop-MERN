import React, { useEffect } from 'react';
import Product from '../components/productCard/Product';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../actions/productAction';
import Loader from '../components/Loader/Loader'

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);
   
  const {products = [], loading, error} = useSelector((state)=>state.products);

  if (loading) return <Loader />;

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <h1 className="hero-title">Featured Products</h1>
        <p className="hero-subtitle">Discover our handpicked collection of premium products</p>
      </div>

      <div className="products-grid">
        {products && products.length > 0 ? (
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products-message">
            <p>No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;