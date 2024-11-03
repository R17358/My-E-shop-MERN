import React from 'react'
import { useEffect } from 'react'
import Product from '../components/productCard/Product'
import './Home.css'
import {useDispatch, useSelector} from "react-redux"
import { getProduct } from '../actions/productAction'
import { useParams } from 'react-router-dom'

function ProductPage() {

  const dispatch = useDispatch();

  const {keyword} = useParams();

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  
  const {products = []} = useSelector((state)=>state.products);

  // Function to filter products based on the keyword
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(keyword?.toLowerCase())
  );

  return (
    <div>
        <h1>All Products</h1>
        <div className="container">
        {keyword ? (
          // Display filtered products when a keyword is present
          filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))
          ) : (
            <p>No products found.</p> // Message when no products match the search
          )
        ) : (
          // Display all products if no keyword is present
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        )}
          
        </div>
    </div>
  )
}

export default ProductPage