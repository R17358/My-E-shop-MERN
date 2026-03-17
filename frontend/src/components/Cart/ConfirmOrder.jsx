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

  // ── Group items by seller ─────────────────────────────────────────────────
  const itemsBySeller = cartItems.reduce((acc, item) => {
    const sellerKey = item.sellerName || item.seller || "Unknown Seller";
    if (!acc[sellerKey]) acc[sellerKey] = [];
    acc[sellerKey].push(item);
    return acc;
  }, {});

  const multiVendor = Object.keys(itemsBySeller).length > 1;

  // ── Per-seller breakdown helper ───────────────────────────────────────────
  // MUST match backend newOrder exactly:
  //   shippingPrice = sum of shippingCharges per ITEM (not max per seller)
  //   taxPrice      = sum of ((itemPrice + itemShipping) * gstPercent/100) per ITEM
  const getSellerBreakdown = (items) => {
    let productTotal = 0;
    let shipping = 0;
    let tax = 0;

    for (const item of items) {
      const itemPrice = item.price * item.quantity;
      const itemShipping = item.shippingCharges ?? 50;
      const gstRate = (item.gstPercent ?? 18) / 100;
      const itemTax = (itemPrice + itemShipping) * gstRate;

      productTotal += itemPrice;
      shipping += itemShipping;       // sum per item — matches backend
      tax += itemTax;                 // GST per item — matches backend
    }

    const total = productTotal + shipping + tax;
    return { productTotal, shipping, tax, total };
  };

  // ── Grand totals (sum across all sellers) ────────────────────────────────
  let subtotal = 0;
  let shippingCharges = 0;
  let tax = 0;

  for (const item of cartItems) {
    const itemPrice = item.price * item.quantity;
    const itemShipping = item.shippingCharges ?? 50;
    const gstRate = (item.gstPercent ?? 18) / 100;

    subtotal += itemPrice;
    shippingCharges += itemShipping;
    tax += (itemPrice + itemShipping) * gstRate;
  }

  const totalPrice = subtotal + shippingCharges + tax;

  // ── Address string ────────────────────────────────────────────────────────
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  // ── Proceed to payment ────────────────────────────────────────────────────
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
              const { productTotal, shipping, tax: sellerTax, total } = getSellerBreakdown(items);

              return (
                <div key={sellerName} className="seller-group">

                  {/* Seller header */}
                  <div className="seller-group-header">
                    <Store size={15} />
                    <span>Sold & shipped by <strong>{sellerName}</strong></span>
                    <span className="shipping-note">
                      <Truck size={13} />
                      {items.length} shipment{items.length > 1 ? "s" : ""}
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
                          <span className="item-shipping-note">
                            + ₹{(item.shippingCharges ?? 50).toFixed(2)} shipping
                            · {item.gstPercent ?? 18}% GST on (price + shipping)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Per-seller breakdown */}
                  <div className="seller-breakdown">
                    <div className="breakdown-row">
                      <span>
                        Products ({items.reduce((a, i) => a + i.quantity, 0)} items)
                      </span>
                      <span>₹{productTotal.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Shipping (per item)</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>GST (on price + shipping per item)</span>
                      <span>₹{sellerTax.toFixed(2)}</span>
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
                <span>Shipping ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})</span>
                <span>₹{shippingCharges.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>GST (on price + shipping per item)</span>
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

          <div className="calc-note">
            <p>
              💡 Shipping is charged per item. GST is applied on
              (item price + item shipping) for each product individually.
            </p>
          </div>
        </div>

      </div>
    </Fragment>
  );
};

export default ConfirmOrder;