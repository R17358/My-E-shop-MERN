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
    <div>
      <h1>Featured Products</h1>
      <div className="container">
        {products &&
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default Home;
