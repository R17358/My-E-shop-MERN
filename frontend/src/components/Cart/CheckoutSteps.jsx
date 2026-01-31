import React, { Fragment } from "react";
import "./CheckoutSteps.css";
import { Truck, ClipboardCheck, CreditCard, Check } from "lucide-react";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: "Shipping",
      icon: Truck,
    },
    {
      label: "Confirm Order",
      icon: ClipboardCheck,
    },
    {
      label: "Payment",
      icon: CreditCard,
    },
  ];

  return (
    <Fragment>
      <div className="checkout-steps">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          
          return (
            <div 
              key={index} 
              className={`checkout-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-icon">
                {isCompleted ? <Check size={24} /> : <Icon size={24} />}
              </div>
              <span className="step-label">{step.label}</span>
              {index < steps.length - 1 && (
                <div className="step-connector"></div>
              )}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default CheckoutSteps;