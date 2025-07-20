import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstants";

import axios from "../api/axios";
import { toast } from "react-toastify";


// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     config.headers.withCredentials = true; // Include cookies if used
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Create Order
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
   
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
    };
    const { data } = await axios.post("/order/new", order, config);

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
    toast.success("Order Created")
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
    toast.error(error.response.data.message || "Couldn't Create Order")
  }
};

// My Orders
export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ORDERS_REQUEST });
    const config = {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     'Content-Type': 'application/json',
    //     withCredentials: true,
      },
     };
    const { data } = await axios.get("/orders/me",config);

    dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL,
      payload: error.response.data.message,
    })
  }
};

// Get All Orders (admin)
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });


    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
   //     'Content-Type': 'application/json',
   //     withCredentials: true,
     },
    };

    const { data } = await axios.get("/admin/orders",config);

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Order
export const updateOrder = (id, order) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    };
    const { data } = await axios.put(
      `/admin/order/${id}`,
      order,
      config
    );

    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    };
    const { data } = await axios.delete(`/admin/order/${id}`, config);

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    };
    const { data } = await axios.get(`/order/${id}`,config);
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
    //console.log(data)
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
