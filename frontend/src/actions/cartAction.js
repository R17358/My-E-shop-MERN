import { toast } from "react-toastify";
import axios from "../api/axios";
import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/product/${id}`);

  console.log(data)

  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      stock: data.product.stock,
      quantity,
      // ✅ These 3 are new — pulled from product schema
      shippingCharges: data.product.shippingCharges,
      gstPercent: data.product.gstPercent,
      sellerName: data.product.seller?.name || "Store",
      seller: data.product.seller?._id,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  toast.success("Added to cart")
};

export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_CART_ITEM, payload: id });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data });
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};