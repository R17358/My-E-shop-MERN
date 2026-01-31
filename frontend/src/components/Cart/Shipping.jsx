import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import { Country, State } from "country-state-city";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MapPin, Phone } from "lucide-react";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      toast.error("Phone Number should be 10 digits Long");
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <CheckoutSteps activeStep={0} />

      <div className="shipping-container">
        <div className="shipping-card">
          <div className="shipping-header">
            <MapPin size={32} className="shipping-icon" />
            <h2>Shipping Details</h2>
            <p>Enter your delivery information</p>
          </div>

          <form className="shipping-form" onSubmit={shippingSubmit}>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                placeholder="Enter your full address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pinCode">Pin Code</label>
                <input
                  id="pinCode"
                  type="number"
                  placeholder="Pin Code"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNo">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                id="phoneNo"
                type="number"
                placeholder="10-digit phone number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Select State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="shipping-submit-btn"
              disabled={!state}
            >
              Continue to Order Confirmation
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;