import React, { useEffect } from 'react';
import Product from '../components/productCard/Product';
import './Home.css';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../actions/productAction';

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // // Step 1: Get token from URL
    // const params = new URLSearchParams(window.location.search);
    // const token = params.get('token');

    // if (token) {
    //   // Step 2: Save token to localStorage
    //   localStorage.setItem('token', token);

    //   // Step 3 (optional): Clean the URL
    //   window.history.replaceState({}, document.title, '/');
    // }

    // Step 4: Dispatch product action
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
