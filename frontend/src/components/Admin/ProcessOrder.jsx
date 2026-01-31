import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./processOrder.css";
import { toast } from "react-toastify";
import { Sun, Moon, MapPin, CreditCard, Package, CheckCircle, XCircle, Truck } from 'lucide-react';

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("status", status);

    dispatch(updateOrder(id, myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      toast.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
      navigate("/admin/orders");
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id, isUpdated, updateError, navigate]);

  return (
    <Fragment>
      <div className="process-order-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading order details...</p>
          </div>
        ) : (
          <div className="process-order-container">
            <div className="process-hero">
              <h1 className="hero-title">Process Order</h1>
              <p className="order-id">Order ID: <span>#{order?._id}</span></p>
            </div>

            <div className="process-grid">
              <div className="order-info-section">
                <div className="info-card">
                  <div className="card-header">
                    <MapPin size={20} />
                    <h2>Shipping Info</h2>
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

                <div className="info-card">
                  <div className="card-header">
                    <CreditCard size={20} />
                    <h2>Payment</h2>
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
                            <Truck size={16} />
                            {order?.orderStatus || "Status Not Available"}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-items-card">
                  <div className="card-header">
                    <Package size={20} />
                    <h2>Cart Items</h2>
                  </div>
                  <div className="order-items-grid">
                    {order?.orderItems?.map((item) => (
                      <div key={item.product} className="order-item">
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
              </div>

              {order?.orderStatus !== "Delivered" && (
                <div className="update-section">
                  <form className="update-form" onSubmit={updateOrderSubmitHandler}>
                    <div className="form-header">
                      <Truck size={24} />
                      <h2>Update Order Status</h2>
                    </div>

                    <div className="form-group">
                      <label htmlFor="status">Change Status</label>
                      <select 
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Choose Status</option>
                        {order?.orderStatus === "Processing" && (
                          <option value="Shipped">Shipped</option>
                        )}
                        {order?.orderStatus === "Shipped" && (
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    <button
                      className="submit-btn"
                      type="submit"
                      disabled={loading || status === ""}
                    >
                      <CheckCircle size={20} />
                      Update Status
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ProcessOrder;