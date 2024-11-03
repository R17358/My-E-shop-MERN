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

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);

  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

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
      navigate("/admin/orders"); // Redirect after update
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id, isUpdated, updateError, navigate]);

  return (
    <Fragment>
      <div className="dashboard">
        <div className="newProductContainer">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div
              className="confirmOrderPage"
              style={{
                display: order?.orderStatus === "Delivered" ? "block" : "grid",
              }}
            >
              <div className="orderUpdateMain">
                <div className="confirmshippingArea">
                  <Typography>Shipping Info</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p>Name:</p>
                      <span>{order?.user?.name}</span>
                    </div>
                    <div>
                      <p>Phone:</p>
                      <span>{order?.shippingInfo?.phoneNo}</span>
                    </div>
                    <div>
                      <p>Address:</p>
                      <span>
                        {order?.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order?.paymentInfo?.status === "succeeded"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order?.paymentInfo?.status === "succeeded"
                          ? "PAID"
                          : "NOT PAID"}
                      </p>
                    </div>

                    <div>
                      <p>Amount:</p>
                      <span>{order?.totalPrice}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className="orderDetailsContainerBox">
                    <div>
                      <p
                        className={
                          order?.orderStatus === "Delivered"
                            ? "greenColor"
                            : "redColor"
                        }
                      >
                        {order?.orderStatus || "Status Not Available"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="confirmCartItems">
                  <Typography>Your Cart Items:</Typography>
                  <div className="confirmCartItemsContainer">
                    {order?.orderItems?.map((item) => (
                      <div key={item.product}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>{" "}
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: order?.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <select onChange={(e) => setStatus(e.target.value)}>
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
                    id="createProductBtn"
                    type="submit"
                    disabled={loading || status === ""}
                  >
                    Process
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
