import React, { useEffect } from 'react';
import Product from '../components/productCard/Product';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../actions/productAction';

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(getProduct());
  }, [dispatch]);

  const { products = [] } = useSelector((state) => state.products);

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
