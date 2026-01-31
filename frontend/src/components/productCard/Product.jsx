import React from 'react'
import './product.css'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItemsToCart } from '../../actions/cartAction'
import { ShoppingCart } from 'lucide-react'

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
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img src={product.images[0].url} alt={product.name} className="product-img"/>
          <div className="product-overlay">
            <span className="view-text">View Details</span>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="product-footer-row">
            <div className="product-price-container">
              <span className="currency">₹</span>
              <span className="amount">{product.price}</span>
            </div>
            {qty > 0 && <span className="cart-badge">{qty}</span>}
          </div>
        </div>
      </Link>
      
      <button 
        type="button" 
        className="cart-btn" 
        onClick={addToCartHandler}
      >
        <ShoppingCart size={16} strokeWidth={2.5} />
        <span>ADD TO CART</span>
      </button>
    </div>
  )
}

export default Product