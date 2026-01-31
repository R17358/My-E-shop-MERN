import React, { Fragment, useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import axios from "../../api/axios"
import "./payment.css";
import { CreditCard, Calendar, Lock, Shield } from "lucide-react";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const orderInfo = JSON.parse(localStorage.getItem("orderInfo")) || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
     
        const config = {
          headers: {
            "Content-Type":"application/json",
             Authorization: `Bearer ${localStorage.getItem("token")}`,
             withCredentials:true
          },
        };
    
      const { data } = await axios.post(
        "/payment/process",
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) {
        payBtn.current.disabled = false;
        return;
      }

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));
          toast.success("Paid successfully !")
          navigate("/success");
        } else {
          toast.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <CheckoutSteps activeStep={2} />
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-header">
            <Shield size={32} className="payment-icon" />
            <h2>Payment Details</h2>
            <p>Enter your card information securely</p>
          </div>

          <form className="payment-form" onSubmit={(e) => submitHandler(e)}>
            <div className="payment-amount">
              <span>Total Amount</span>
              <span className="amount-value">₹{orderInfo && orderInfo.totalPrice}</span>
            </div>

            <div className="form-group">
              <label>
                <CreditCard size={16} />
                Card Number
              </label>
              <div className="stripe-input-wrapper">
                <CardNumberElement className="stripe-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Expiry Date
                </label>
                <div className="stripe-input-wrapper">
                  <CardExpiryElement className="stripe-input" />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Lock size={16} />
                  CVC
                </label>
                <div className="stripe-input-wrapper">
                  <CardCvcElement className="stripe-input" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              ref={payBtn}
              className="payment-submit-btn"
            >
              <Lock size={18} />
              <span>Pay ₹{orderInfo && orderInfo.totalPrice}</span>
            </button>

            <div className="payment-security">
              <Shield size={16} />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;