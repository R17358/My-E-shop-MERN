import React, { Fragment, useEffect, useState } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import { toast } from "react-toastify";
import {
  Sun, Moon, MapPin, CreditCard, Package,
  CheckCircle, XCircle, Store, Truck, Receipt, TrendingUp
} from "lucide-react";

const OrderDetails = () => {
  const { order, subOrders, error, loading } = useSelector((state) => state.orderDetails);

  // console.log(order)

  // console.log(subOrders)
  const dispatch = useDispatch();
  const { id } = useParams();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);

  const multiVendor = (subOrders?.length || 0) > 1;

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered": return "delivered";
      case "Shipped":   return "shipped";
      case "Cancelled": return "cancelled";
      default:          return "processing";
    }
  };

  return (
    <Fragment>
      <div className="order-details-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading order details...</p>
          </div>
        ) : (
          <Fragment>

            {/* ── Hero ── */}
            <div className="order-details-hero">
              <h1 className="hero-title">Order Details</h1>
              <p className="order-id">Order ID: <span>#{order?._id}</span></p>
              <p className="order-date">
                Placed on{" "}
                {new Date(order?.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>

            {/* ── Info Cards ── */}
            <div className="order-details-grid">

              {/* Shipping Info */}
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

              {/* Payment Info */}
              <div className="info-card">
                <div className="card-header">
                  <CreditCard size={20} />
                  <h2>Payment Information</h2>
                </div>
                <div className="card-content">
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className={`payment-status ${order?.paymentInfo?.status === "succeeded" ? "paid" : "unpaid"}`}>
                      {order?.paymentInfo?.status === "succeeded"
                        ? <><CheckCircle size={16} /> PAID</>
                        : <><XCircle size={16} /> NOT PAID</>}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Paid At:</span>
                    <span className="value">
                      {order?.paidAt
                        ? new Date(order.paidAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Amount:</span>
                    <span className="value amount">₹{order?.totalPrice?.toFixed(2)}</span>
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
                    <span className="label">Status:</span>
                    <span className={`order-status ${getStatusClass(order?.orderStatus)}`}>
                      {order?.orderStatus === "Delivered"
                        ? <><CheckCircle size={16} /> Delivered</>
                        : order?.orderStatus === "Shipped"
                        ? <><Truck size={16} /> Shipped</>
                        : order?.orderStatus === "Cancelled"
                        ? <><XCircle size={16} /> Cancelled</>
                        : <><Package size={16} /> {order?.orderStatus || "Processing"}</>}
                    </span>
                  </div>
                  {order?.deliveredAt && (
                    <div className="info-row">
                      <span className="label">Delivered:</span>
                      <span className="value">
                        {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {multiVendor && (
                    <div className="info-row">
                      <span className="label">Sellers:</span>
                      <span className="value">{subOrders.length} separate shipments</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── SubOrders — one card per seller ── */}
            <div className="order-items-section">
              <div className="section-header">
                <h2>
                  Order Items
                  {multiVendor && (
                    <span className="multi-vendor-badge">
                      {subOrders.length} Sellers
                    </span>
                  )}
                </h2>
              </div>

              <div className="seller-groups-wrapper">
                {(subOrders || []).map((sub) => (
                  <div key={sub._id} className="od-seller-group">

                    {/* Seller header */}
                    <div className="od-seller-header">
                      <Store size={15} />
                      <span>
                        Sold & shipped by{" "}
                        <strong>{sub.seller?.name || "Unknown Seller"}</strong>
                      </span>
                      <span className={`od-status-pill ${getStatusClass(sub.orderStatus)}`}>
                        {sub.orderStatus === "Shipped"
                          ? <><Truck size={12} /> Shipped</>
                          : sub.orderStatus === "Delivered"
                          ? <><CheckCircle size={12} /> Delivered</>
                          : sub.orderStatus === "Cancelled"
                          ? <><XCircle size={12} /> Cancelled</>
                          : <><Package size={12} /> {sub.orderStatus}</>}
                      </span>
                      {sub.shippedAt && (
                        <span className="od-ship-date">
                          Shipped{" "}
                          {new Date(sub.shippedAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <div className="order-items-grid">
                      {sub.orderItems?.map((item) => (
                        <div key={item._id} className="order-item-card">
                          <div className="item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="item-details">
                            <Link to={`/product/${item.product}`} className="item-name">
                              {item.name}
                            </Link>
                            <div className="item-pricing">
                              <span className="quantity">
                                {item.quantity} × ₹{item.price}
                              </span>
                              <span className="total">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Per-seller breakdown — all values from subOrder directly, zero calculations */}
                    <div className="od-seller-breakdown">
                      <div className="od-breakdown-row">
                        <span>
                          Products ({sub.orderItems?.reduce((a, i) => a + i.quantity, 0)} items)
                        </span>
                        <span>₹{sub.itemsPrice?.toFixed(2)}</span>
                      </div>
                      <div className="od-breakdown-row">
                        <span>Shipping (flat, 1 box)</span>
                        <span>₹{sub.shippingPrice?.toFixed(2)}</span>
                      </div>
                      <div className="od-breakdown-row">
                        <span>Tax / GST</span>
                        <span>₹{sub.taxPrice?.toFixed(2)}</span>
                      </div>
                      <div className="od-breakdown-row od-seller-total">
                        <span>Seller Total</span>
                        <span>₹{sub.totalPrice?.toFixed(2)}</span>
                      </div>
                      <div className="od-breakdown-divider" />
                      <div className="od-breakdown-row od-commission-row">
                        <span>
                          <TrendingUp size={12} />
                          &nbsp;Platform Commission
                        </span>
                        <span>- ₹{sub.platformCommission?.toFixed(2)}</span>
                      </div>
                      <div className="od-breakdown-row od-earnings-row">
                        <span>Seller Earnings (after commission)</span>
                        <span>₹{sub.sellerEarnings?.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* ── Grand Summary — from main order fields, zero calculations ── */}
            <div className="od-grand-summary">
              <div className="od-grand-header">
                <Receipt size={20} />
                <h2>Price Breakdown</h2>
              </div>
              <div className="od-grand-rows">
                <div className="od-grand-row">
                  <span>
                    Subtotal (
                    {(order?.orderItems || []).reduce((a, i) => a + i.quantity, 0)} items)
                  </span>
                  <span>₹{order?.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="od-grand-row">
                  <span>
                    Shipping ({subOrders?.length || 1} seller
                    {(subOrders?.length || 1) > 1 ? "s" : ""}, flat per seller)
                  </span>
                  <span>₹{order?.shippingPrice?.toFixed(2)}</span>
                </div>
                <div className="od-grand-row">
                  <span>Tax / GST</span>
                  <span>₹{order?.taxPrice?.toFixed(2)}</span>
                </div>
                <div className="od-grand-row od-grand-total">
                  <span>Total Paid</span>
                  <span>₹{order?.totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              {multiVendor && (
                <p className="od-multi-note">
                  * Items from {subOrders.length} sellers will arrive in separate shipments.
                </p>
              )}
            </div>

          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default OrderDetails;