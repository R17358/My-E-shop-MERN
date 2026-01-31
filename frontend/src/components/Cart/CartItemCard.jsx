import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

const CartItemCard = ({ item, deleteCartItems }) => {
  return (
    <div className="cart-item-card">
      <Link to={`/product/${item.product}`} className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </Link>
      <div className="cart-item-details">
        <Link to={`/product/${item.product}`} className="cart-item-name">
          {item.name}
        </Link>
        <div className="cart-item-price">₹{item.price}</div>
      </div>
      <button 
        className="cart-item-remove" 
        onClick={() => deleteCartItems(item.product)}
        aria-label="Remove item from cart"
      >
        <Trash2 size={18} />
        <span>Remove</span>
      </button>
    </div>
  );
};

export default CartItemCard;