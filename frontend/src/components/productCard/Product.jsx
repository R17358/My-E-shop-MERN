import React from 'react'
import './product.css'
import chair from '../../pages/chair.webp'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart } from '../../actions/cartAction'

function Product({product}) {

  const dispatch = useDispatch();
  const val = useSelector((state)=>state.cart)
  let qty = 0
  const addToCartHandler = () => {

    val.cartItems.map((item)=>{
      if(item.product === product._id)
      {
        qty = item.quantity;
      }
    })
    dispatch(addItemsToCart(product._id, qty+1));
    
  };

  return (
    <div>
        <div className="card">
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="productHead">
              <h2>{product.name}</h2>
            </div>
            <img src={product.images[0].url} alt={product.name}/>
            <p className='desc'><b>Description:</b>{product.description}</p>
            <h4>{product.price} /-</h4>
            </Link>
            <button type="button" onClick={addToCartHandler}>ADD TO CART</button>
        </div>
        
    </div>
  )
}

export default Product