import React, { Fragment } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector } from "react-redux";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Package, MapPin, CreditCard, Truck, Store } from "lucide-react";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // ── Group items by seller FIRST (needed for per-seller flat shipping) ───────
  const itemsBySeller = cartItems.reduce((acc, item) => {
    const sellerKey = item.sellerName || item.seller || "Unknown Seller";
    if (!acc[sellerKey]) acc[sellerKey] = [];
    acc[sellerKey].push(item);
    return acc;
  }, {});

  const multiVendor = Object.keys(itemsBySeller).length > 1;

  // ── Calculations ─────────────────────────────────────────────────────────────

  // Product prices only (no shipping, no tax)
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Per SELLER flat shipping — highest charge among seller's products, charged ONCE per seller
  // Logic: all items from one seller ship in one box → one shipping fee
  const shippingCharges = Object.values(itemsBySeller).reduce((acc, items) => {
    const sellerShipping = Math.max(...items.map((i) => i.shippingCharges ?? 50));
    return acc + sellerShipping;
  }, 0);

  // GST on (product price × quantity + seller's flat shipping) per seller group
  // Standard Indian GST: applied on product + shipping combined
  const tax = Object.values(itemsBySeller).reduce((acc, items) => {
    const sellerProductTotal = items.reduce(
      (s, item) => s + item.price * item.quantity,
      0
    );
    const sellerShipping = Math.max(...items.map((i) => i.shippingCharges ?? 50));
    // Use the gstPercent of first item in group (seller-level GST)
    const gstRate = (items[0].gstPercent ?? 18) / 100;
    return acc + (sellerProductTotal + sellerShipping) * gstRate;
  }, 0);

  const totalPrice = subtotal + shippingCharges + tax;

  // ── Address string ────────────────────────────────────────────────────────────
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  // ── Proceed to payment ────────────────────────────────────────────────────────
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

  // ── Per-seller breakdown helper ───────────────────────────────────────────────
  const getSellerBreakdown = (items) => {
    const productTotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = Math.max(...items.map((i) => i.shippingCharges ?? 50));
    const gstRate = (items[0].gstPercent ?? 18) / 100;
    const gst = (productTotal + shipping) * gstRate;
    const total = productTotal + shipping + gst;
    return { productTotal, shipping, gst, total };
  };

  return (
    <Fragment>
      <CheckoutSteps activeStep={1} />
      <div className="confirm-order-page">

        {/* ── Left Section ── */}
        <div className="confirm-details-section">

          {/* Shipping Info */}
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

          {/* Order Items — grouped by seller */}
          <div className="confirm-section">
            <div className="section-header">
              <Package size={24} />
              <h3>Order Items</h3>
              {multiVendor && (
                <span className="multi-vendor-badge">
                  {Object.keys(itemsBySeller).length} Sellers
                </span>
              )}
            </div>

            {Object.entries(itemsBySeller).map(([sellerName, items]) => {
              const { productTotal, shipping, gst, total } = getSellerBreakdown(items);
              const gstPercent = items[0].gstPercent ?? 18;

              return (
                <div key={sellerName} className="seller-group">

                  {/* Seller header */}
                  <div className="seller-group-header">
                    <Store size={15} />
                    <span>Sold & shipped by <strong>{sellerName}</strong></span>
                    <span className="shipping-note">
                      <Truck size={13} />
                      1 shipment
                    </span>
                  </div>

                  {/* Items */}
                  <div className="cart-items-list">
                    {items.map((item) => (
                      <div key={item.product} className="confirm-cart-item">
                        <img src={item.image} alt={item.name} />
                        <div className="item-info">
                          <Link to={`/product/${item.product}`} className="item-name">
                            {item.name}
                          </Link>
                          <span className="item-calculation">
                            {item.quantity} × ₹{item.price} ={" "}
                            <b>₹{(item.price * item.quantity).toFixed(2)}</b>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Per-seller breakdown */}
                  <div className="seller-breakdown">
                    <div className="breakdown-row">
                      <span>Products ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                      <span>₹{productTotal.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Shipping (flat, 1 box)</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>GST ({gstPercent}% on products + shipping)</span>
                      <span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row seller-total-row">
                      <span>Seller Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Section: Order Summary ── */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="summary-header">
              <CreditCard size={24} />
              <h3>Order Summary</h3>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>
                  Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)}{" "}
                  item{cartItems.reduce((a, i) => a + i.quantity, 0) > 1 ? "s" : ""})
                </span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>
                  Shipping ({Object.keys(itemsBySeller).length} seller
                  {Object.keys(itemsBySeller).length > 1 ? "s" : ""})
                </span>
                <span>₹{shippingCharges.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST (on products + shipping)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            {multiVendor && (
              <p className="multi-vendor-note">
                * Items from {Object.keys(itemsBySeller).length} sellers will
                arrive in separate shipments.
              </p>
            )}

            <button className="proceed-btn" onClick={proceedToPayment}>
              Proceed to Payment
            </button>
          </div>

          {/* Calculation logic note for transparency */}
          <div className="calc-note">
            <p>💡 Shipping is charged once per seller (flat rate, all items in one box). GST is applied on product price + shipping combined.</p>
          </div>
        </div>

      </div>
    </Fragment>
  );
};

export default ConfirmOrder;