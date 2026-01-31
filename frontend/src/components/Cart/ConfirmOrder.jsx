import React, { Fragment } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, CreditCard } from "lucide-react";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  
  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    localStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <Fragment>
      <CheckoutSteps activeStep={1} />
      <div className="confirm-order-page">
        <div className="confirm-details-section">
          <div className="confirm-section">
            <div className="section-header">
              <MapPin size={24} />
              <h3>Shipping Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{shippingInfo.phoneNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Address:</span>
                <span className="info-value">{address}</span>
              </div>
            </div>
          </div>

          <div className="confirm-section">
            <div className="section-header">
              <Package size={24} />
              <h3>Order Items</h3>
            </div>
            <div className="cart-items-list">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product} className="confirm-cart-item">
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`} className="item-name">
                      {item.name}
                    </Link>
                    <span className="item-calculation">
                      {item.quantity} × ₹{item.price} = <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="summary-header">
              <CreditCard size={24} />
              <h3>Order Summary</h3>
            </div>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className={shippingCharges === 0 ? 'free-shipping' : ''}>
                  {shippingCharges === 0 ? 'FREE' : `₹${shippingCharges}`}
                </span>
              </div>
              <div className="summary-row">
                <span>GST (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total:</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <button className="proceed-btn" onClick={proceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;