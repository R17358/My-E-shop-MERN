import React, { Fragment } from "react";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <p>Shipping Details</p>,
    },
    {
      label: <p>Confirm Order</p>,
    },
    {
      label: <p>Payment</p>,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <Fragment>
      
    </Fragment>
  );
};

export default CheckoutSteps;
