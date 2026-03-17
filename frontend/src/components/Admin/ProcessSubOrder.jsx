import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./processOrder.css";
import { toast } from "react-toastify";
import {
  Sun, Moon, MapPin, CreditCard, Package,
  CheckCircle, XCircle, Truck, DollarSign,
} from "lucide-react";
import { getSubOrderDetails, updateSubOrder, clearErrors } from "../../actions/orderAction";

const ProcessSubOrder = () => {
  // FIX: state stores it as 'order', aliased here as 'subOrder'
  const { order: subOrder, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [courier, setCourier] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Submit handler
  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const orderData = { status };
    if (trackingId && courier) {
      orderData.trackingInfo = { trackingId, courier };
    }
    dispatch(updateSubOrder(id, orderData));
  };

  // Side effects
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
      if (user?.role === "seller") {
        navigate("/seller/orders");
      } else {
        navigate("/admin/orders");
      }
    }
    dispatch(getSubOrderDetails(id));
  }, [dispatch, error, id, isUpdated, updateError, navigate, user]);

  // Helper: status CSS class
  const getStatusClass = (s) => {
    switch (s) {
      case "Delivered": return "delivered";
      case "Shipped":   return "shipped";
      case "Cancelled": return "cancelled";
      default:          return "processing";
    }
  };

  // Helper: status icon
  const getStatusIcon = (s) => {
    switch (s) {
      case "Delivered": return <CheckCircle size={14} />;
      case "Shipped":   return <Truck size={14} />;
      case "Cancelled": return <XCircle size={14} />;
      default:          return <Truck size={14} />;
    }
  };

  return (
    <Fragment>
      <div className="process-order-wrapper">

        {/* Theme toggle */}
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading order details...</p>
          </div>
        ) : (
          <div className="process-order-container">

            {/* Hero */}
            <div className="process-hero">
              <h1 className="hero-title">Process Order</h1>
              <p className="order-id">
                SubOrder ID: <span>#{subOrder?._id}</span>
              </p>
            </div>

            <div className="process-grid">
              <div className="order-info-section">

                {/* ── Shipping Info ── */}
                <div className="info-card">
                  <div className="card-header">
                    <MapPin size={20} />
                    <h2>Shipping Info</h2>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Customer:</span>
                      <span className="value">{subOrder?.customer?.name || "—"}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span className="value">{subOrder?.shippingInfo?.phoneNo || "—"}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Address:</span>
                      <span className="value">
                        {subOrder?.shippingInfo
                          ? `${subOrder.shippingInfo.address}, ${subOrder.shippingInfo.city}, ${subOrder.shippingInfo.state}, ${subOrder.shippingInfo.pinCode}, ${subOrder.shippingInfo.country}`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Earnings ── */}
                <div className="info-card earnings-card">
                  <div className="card-header">
                    <DollarSign size={20} />
                    <h2>Your Earnings</h2>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Items Price:</span>
                      <span className="value">₹{subOrder?.itemsPrice?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Shipping:</span>
                      <span className="value">₹{subOrder?.shippingPrice?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">GST:</span>
                      <span className="value">₹{subOrder?.taxPrice?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div className="info-row highlight">
                      <span className="label">Subtotal:</span>
                      <span className="value">₹{subOrder?.totalPrice?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div className="info-row commission">
                      <span className="label">Platform Commission:</span>
                      <span className="value">-₹{subOrder?.platformCommission?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    <div className="info-row earnings">
                      <span className="label">You Earn:</span>
                      <span className="value">₹{subOrder?.sellerEarnings?.toFixed(2) ?? "0.00"}</span>
                    </div>
                  </div>
                </div>

                {/* ── Payment Status ── */}
                <div className="info-card">
                  <div className="card-header">
                    <CreditCard size={20} />
                    <h2>Payment Status</h2>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Payment Status:</span>
                      <span className={`payment-status ${subOrder?.paymentStatus === "succeeded" ? "paid" : "unpaid"}`}>
                        {subOrder?.paymentStatus === "succeeded" ? (
                          <><CheckCircle size={13} /> PAID TO YOU</>
                        ) : (
                          <><XCircle size={13} /> PENDING</>
                        )}
                      </span>
                    </div>
                    {subOrder?.sellerPaidAt && (
                      <div className="info-row">
                        <span className="label">Paid On:</span>
                        <span className="value">
                          {new Date(subOrder.sellerPaidAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Order Status ── */}
                <div className="info-card">
                  <div className="card-header">
                    <Package size={20} />
                    <h2>Order Status</h2>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Your SubOrder Status:</span>
                      <span className={`order-status ${getStatusClass(subOrder?.orderStatus)}`}>
                        {getStatusIcon(subOrder?.orderStatus)}
                        {subOrder?.orderStatus || "Processing"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">Main Order Status:</span>
                      <span className={`order-status ${getStatusClass(subOrder?.mainOrder?.orderStatus)}`}>
                        {getStatusIcon(subOrder?.mainOrder?.orderStatus)}
                        {subOrder?.mainOrder?.orderStatus || "Processing"}
                      </span>
                    </div>
                    {subOrder?.trackingInfo?.trackingId && (
                      <>
                        <div className="info-row">
                          <span className="label">Tracking ID:</span>
                          <span className="value">{subOrder.trackingInfo.trackingId}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Courier:</span>
                          <span className="value">{subOrder.trackingInfo.courier}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Order Items ── */}
                <div className="order-items-card">
                  <div className="card-header">
                    <Package size={20} />
                    <h2>Order Items</h2>
                  </div>
                  <div className="order-items-grid">
                    {subOrder?.orderItems?.length > 0 ? (
                      subOrder.orderItems.map((item) => (
                        <div key={item.product} className="order-item">
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
                      ))
                    ) : (
                      <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                        No items found.
                      </p>
                    )}
                  </div>
                </div>

              </div>{/* end order-info-section */}

              {/* ── Update Status Form (hidden when Delivered) ── */}
              {subOrder?.orderStatus !== "Delivered" && (
                <div className="update-section">
                  <form className="update-form" onSubmit={updateOrderSubmitHandler}>
                    <div className="form-header">
                      <Truck size={22} />
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
                        {subOrder?.orderStatus === "Processing" && (
                          <option value="Shipped">Shipped</option>
                        )}
                        {subOrder?.orderStatus === "Shipped" && (
                          <option value="Delivered">Delivered</option>
                        )}
                      </select>
                    </div>

                    {/* Tracking fields — only when marking Shipped */}
                    {status === "Shipped" && (
                      <>
                        <div className="form-group">
                          <label htmlFor="trackingId">Tracking ID (Optional)</label>
                          <input
                            type="text"
                            id="trackingId"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="Enter tracking ID"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="courier">Courier Service (Optional)</label>
                          <input
                            type="text"
                            id="courier"
                            value={courier}
                            onChange={(e) => setCourier(e.target.value)}
                            placeholder="e.g., BlueDart, Delhivery"
                          />
                        </div>
                      </>
                    )}

                    <button
                      className="submit-btn"
                      type="submit"
                      disabled={loading || status === ""}
                    >
                      <CheckCircle size={18} />
                      Update Status
                    </button>
                  </form>
                </div>
              )}

            </div>{/* end process-grid */}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ProcessSubOrder;