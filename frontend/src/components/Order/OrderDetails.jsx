import React, { Fragment, useEffect, useState } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import { toast } from "react-toastify";
import { Sun, Moon, MapPin, CreditCard, Package, CheckCircle, XCircle } from 'lucide-react';

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);

  return (
    <Fragment>
      <div className="order-details-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading order details...</p>
          </div>
        ) : (
          <Fragment>
            <div className="order-details-hero">
              <h1 className="hero-title">Order Details</h1>
              <p className="order-id">Order ID: <span>#{order?._id}</span></p>
            </div>

            <div className="order-details-grid">
              {/* Shipping Information */}
              <div className="info-card">
                <div className="card-header">
                  <MapPin size={20} />
                  <h2>Shipping Information</h2>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{order?.user?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{order?.shippingInfo?.phoneNo}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">
                      {order?.shippingInfo &&
                        `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="info-card">
                <div className="card-header">
                  <CreditCard size={20} />
                  <h2>Payment Information</h2>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className={`payment-status ${order?.paymentInfo?.status === "succeeded" ? "paid" : "unpaid"}`}>
                      {order?.paymentInfo?.status === "succeeded" ? (
                        <>
                          <CheckCircle size={16} />
                          PAID
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          NOT PAID
                        </>
                      )}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Amount:</span>
                    <span className="value amount">₹{order?.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="info-card">
                <div className="card-header">
                  <Package size={20} />
                  <h2>Order Status</h2>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="label">Current Status:</span>
                    <span className={`order-status ${order?.orderStatus === "Delivered" ? "delivered" : "processing"}`}>
                      {order?.orderStatus === "Delivered" ? (
                        <>
                          <CheckCircle size={16} />
                          {order?.orderStatus}
                        </>
                      ) : (
                        <>
                          <Package size={16} />
                          {order?.orderStatus || "Status Not Available"}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <div className="section-header">
                <h2>Order Items</h2>
              </div>
              <div className="order-items-grid">
                {order?.orderItems?.map((item) => (
                  <div key={item.product} className="order-item-card">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <Link to={`/product/${item.product}`} className="item-name">
                        {item.name}
                      </Link>
                      <div className="item-pricing">
                        <span className="quantity">{item.quantity} × ₹{item.price}</span>
                        <span className="total">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default OrderDetails;