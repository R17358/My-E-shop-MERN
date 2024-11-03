import React from 'react'
import ProductRow from './ProductRow'
import {useDispatch, useSelector} from "react-redux"
import { getAdminProduct } from '../../actions/productAction';
import { useEffect } from 'react';
import { deleteProduct } from '../../actions/productAction';

function Dashboard() {

  const dispatch = useDispatch()
  const {user} = useSelector((state)=>state.user)
  // console.log(user.user_id)
  useEffect(() => {
    dispatch(getAdminProduct(user.user_id)); 
  }, [dispatch]);


  const deleteProductFunc = (id) => {
    dispatch(deleteProduct(id)); // Dispatch the action to delete the product
};

  const {products = []} = useSelector((state)=>state.products);
  
  return (
    <div>
        <h1>My Products</h1>
        <div className="container">
          {products &&
                products.map((product) => (
                  <ProductRow key={product._id} product={product} onDelete={deleteProductFunc}/>
                ))}
        </div>
    </div>
  )

}

export default Dashboard