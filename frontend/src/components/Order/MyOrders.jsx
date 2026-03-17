import React, { Fragment, useEffect, useState } from "react";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Sun, Moon, Package, ChevronDown, ChevronUp,
  Truck, CheckCircle, XCircle, Store, Eye, ShoppingBag
} from "lucide-react";

const MyOrders = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [expandedOrders, setExpandedOrders] = useState({});

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearErrors()); }
    dispatch(myOrders());
  }, [dispatch, error]);

  const toggleExpand = (orderId) =>
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered": return "status-delivered";
      case "Shipped":   return "status-shipped";
      case "Cancelled": return "status-cancelled";
      default:          return "status-processing";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle size={13} />;
      case "Shipped":   return <Truck size={13} />;
      case "Cancelled": return <XCircle size={13} />;
      default:          return <Package size={13} />;
    }
  };

  // If all subOrders have same status → show that, else → "Multiple"
  const getOverallStatus = (order) => {
    const subs = order.subOrders;
    if (!subs || subs.length === 0) return order.orderStatus;
    const unique = [...new Set(subs.map((s) => s.orderStatus))];
    return unique.length === 1 ? unique[0] : "Multiple";
  };

  return (
    <Fragment>
      <div className="my-orders-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="my-orders-hero">
          <div className="hero-icon"><ShoppingBag size={48} /></div>
          <h1 className="hero-title">{user?.name}'s Orders</h1>
          <p className="hero-subtitle">Track and manage all your orders in one place</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader" /><p>Loading your orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="my-orders-container">

            {/* Table Header */}
            <div className="orders-table-header">
              <span className="col-id">Order ID</span>
              <span className="col-date">Date</span>
              <span className="col-items">Items</span>
              <span className="col-status">Status</span>
              <span className="col-amount">Amount</span>
              <span className="col-actions">Actions</span>
            </div>

            <div className="orders-list">
              {orders.map((order) => {
                const isExpanded = expandedOrders[order._id];
                const overallStatus = getOverallStatus(order);
                const isMultiVendor = (order.subOrders?.length ?? 0) >= 1;
                const totalQty = order.orderItems?.reduce((a, i) => a + i.quantity, 0);

                return (
                  <div key={order._id} className="order-row-wrapper">

                    {/* ── Main order row ── */}
                    <div className="order-row">
                      <span className="col-id">
                        <span className="order-id-text">#{order._id}</span>
                        {isMultiVendor && (
                          <span className="multi-seller-tag">
                            {order.subOrders.length} sellers
                          </span>
                        )}
                      </span>

                      <span className="col-date">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>

                      <span className="col-items">
                        {totalQty} item{totalQty > 1 ? "s" : ""}
                      </span>

                      <span className="col-status">
                        {overallStatus === "Multiple" ? (
                          <span className="status-pill status-mixed">
                            <Package size={13} /> Mixed
                          </span>
                        ) : (
                          <span className={`status-pill ${getStatusClass(overallStatus)}`}>
                            {getStatusIcon(overallStatus)} {overallStatus}
                          </span>
                        )}
                      </span>

                      <span className="col-amount">₹{order.totalPrice?.toFixed(2)}</span>

                      <span className="col-actions">
                        <Link to={`/order/${order._id}`} className="btn-view">
                          <Eye size={14} /> View
                        </Link>
                        {/* Expand button only for multi-vendor orders */}
                        {isMultiVendor && (
                          <button className="btn-expand" onClick={() => toggleExpand(order._id)}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}
                      </span>
                    </div>

                    {/* ── Expanded seller rows — only for multi-vendor ── */}
                    {isMultiVendor && isExpanded && (
                      <div className="seller-rows">
                        {order.subOrders.map((sub) => {
                          const subQty = sub.orderItems?.reduce((a, i) => a + i.quantity, 0);
                          return (
                            <div key={sub._id} className="seller-row">

                              <div className="seller-row-left">
                                <Store size={14} />
                                <span className="seller-name">
                                  {sub.seller?.name || "Unknown Seller"}
                                </span>
                                <span className="seller-items">
                                  {subQty} item{subQty > 1 ? "s" : ""}
                                </span>
                              </div>

                              <div className="seller-row-right">
                                <span className="seller-amount">
                                  ₹{sub.totalPrice?.toFixed(2)}
                                </span>
                                <span className={`status-pill status-pill-sm ${getStatusClass(sub.orderStatus)}`}>
                                  {getStatusIcon(sub.orderStatus)} {sub.orderStatus}
                                </span>
                                {sub.shippedAt && (
                                  <span className="seller-shipped-date">
                                    Shipped {new Date(sub.shippedAt).toLocaleDateString("en-IN", {
                                      day: "numeric", month: "short",
                                    })}
                                  </span>
                                )}
                              </div>

                              {/* Mini product thumbnails */}
                              <div className="seller-row-items">
                                {sub.orderItems?.slice(0, 4).map((item) => (
                                  <img
                                    key={item._id}
                                    src={item.image}
                                    alt={item.name}
                                    className="item-thumb"
                                    title={item.name}
                                  />
                                ))}
                                {sub.orderItems?.length > 4 && (
                                  <span className="more-items">
                                    +{sub.orderItems.length - 4}
                                  </span>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="no-orders-state">
            <Package size={64} />
            <h3>No Orders Yet</h3>
            <p>Your order history will appear here once you make your first purchase</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default MyOrders;