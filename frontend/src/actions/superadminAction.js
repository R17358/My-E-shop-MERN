import axios from "../api/axios";
import {
  SUPERADMIN_DASHBOARD_REQUEST,
  SUPERADMIN_DASHBOARD_SUCCESS,
  SUPERADMIN_DASHBOARD_FAIL,
  SUPERADMIN_COMMISSIONS_REQUEST,
  SUPERADMIN_COMMISSIONS_SUCCESS,
  SUPERADMIN_COMMISSIONS_FAIL,
  SUPERADMIN_SELLER_COMMISSIONS_REQUEST,
  SUPERADMIN_SELLER_COMMISSIONS_SUCCESS,
  SUPERADMIN_SELLER_COMMISSIONS_FAIL,
  SUPERADMIN_USERS_REQUEST,
  SUPERADMIN_USERS_SUCCESS,
  SUPERADMIN_USERS_FAIL,
  SUPERADMIN_UPDATE_USER_REQUEST,
  SUPERADMIN_UPDATE_USER_SUCCESS,
  SUPERADMIN_UPDATE_USER_FAIL,
  SUPERADMIN_DELETE_USER_REQUEST,
  SUPERADMIN_DELETE_USER_SUCCESS,
  SUPERADMIN_DELETE_USER_FAIL,
  SUPERADMIN_SELLERS_REQUEST,
  SUPERADMIN_SELLERS_SUCCESS,
  SUPERADMIN_SELLERS_FAIL,
  SUPERADMIN_PRODUCTS_REQUEST,
  SUPERADMIN_PRODUCTS_SUCCESS,
  SUPERADMIN_PRODUCTS_FAIL,
  SUPERADMIN_DELETE_PRODUCT_REQUEST,
  SUPERADMIN_DELETE_PRODUCT_SUCCESS,
  SUPERADMIN_DELETE_PRODUCT_FAIL,
  SUPERADMIN_ORDERS_REQUEST,
  SUPERADMIN_ORDERS_SUCCESS,
  SUPERADMIN_ORDERS_FAIL,
  SUPERADMIN_DELETE_ORDER_REQUEST,
  SUPERADMIN_DELETE_ORDER_SUCCESS,
  SUPERADMIN_DELETE_ORDER_FAIL,
  SUPERADMIN_MARK_PAID_REQUEST,
  SUPERADMIN_MARK_PAID_SUCCESS,
  SUPERADMIN_MARK_PAID_FAIL,
  SUPERADMIN_UPDATE_COMMISSION_REQUEST,
  SUPERADMIN_UPDATE_COMMISSION_SUCCESS,
  SUPERADMIN_UPDATE_COMMISSION_FAIL,
  CLEAR_ERRORS,
} from "../constants/superadminConstants";

export const getSuperAdminDashboard = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_DASHBOARD_REQUEST });
    const { data } = await axios.get("/superadmin/dashboard");
    dispatch({ type: SUPERADMIN_DASHBOARD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPERADMIN_DASHBOARD_FAIL, payload: error.response?.data?.message });
  }
};

export const getSuperAdminCommissions = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_COMMISSIONS_REQUEST });
    const { data } = await axios.get("/superadmin/commissions");
    dispatch({ type: SUPERADMIN_COMMISSIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPERADMIN_COMMISSIONS_FAIL, payload: error.response?.data?.message });
  }
};

export const getSellerCommissions = (sellerId) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_SELLER_COMMISSIONS_REQUEST });
    const { data } = await axios.get(`/superadmin/commissions/seller/${sellerId}`);
    dispatch({ type: SUPERADMIN_SELLER_COMMISSIONS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPERADMIN_SELLER_COMMISSIONS_FAIL, payload: error.response?.data?.message });
  }
};

export const getSuperAdminUsers = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_USERS_REQUEST });
    const { data } = await axios.get("/superadmin/users");
    dispatch({ type: SUPERADMIN_USERS_SUCCESS, payload: data.users });
  } catch (error) {
    dispatch({ type: SUPERADMIN_USERS_FAIL, payload: error.response?.data?.message });
  }
};

export const updateUserRole = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_UPDATE_USER_REQUEST });
    await axios.put(`/superadmin/user/${id}`, userData);
    dispatch({ type: SUPERADMIN_UPDATE_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: SUPERADMIN_UPDATE_USER_FAIL, payload: error.response?.data?.message });
  }
};

export const deleteSuperAdminUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_DELETE_USER_REQUEST });
    await axios.delete(`/superadmin/user/${id}`);
    dispatch({ type: SUPERADMIN_DELETE_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: SUPERADMIN_DELETE_USER_FAIL, payload: error.response?.data?.message });
  }
};

export const getSuperAdminSellers = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_SELLERS_REQUEST });
    const { data } = await axios.get("/superadmin/sellers");
    dispatch({ type: SUPERADMIN_SELLERS_SUCCESS, payload: data.sellers });
  } catch (error) {
    dispatch({ type: SUPERADMIN_SELLERS_FAIL, payload: error.response?.data?.message });
  }
};

export const getSuperAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_PRODUCTS_REQUEST });
    const { data } = await axios.get("/superadmin/products");
    dispatch({ type: SUPERADMIN_PRODUCTS_SUCCESS, payload: data.products });
  } catch (error) {
    dispatch({ type: SUPERADMIN_PRODUCTS_FAIL, payload: error.response?.data?.message });
  }
};

export const deleteSuperAdminProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_DELETE_PRODUCT_REQUEST });
    await axios.delete(`/superadmin/product/${id}`);
    dispatch({ type: SUPERADMIN_DELETE_PRODUCT_SUCCESS });
  } catch (error) {
    dispatch({ type: SUPERADMIN_DELETE_PRODUCT_FAIL, payload: error.response?.data?.message });
  }
};

export const getSuperAdminOrders = () => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_ORDERS_REQUEST });
    const { data } = await axios.get("/superadmin/orders");
    dispatch({ type: SUPERADMIN_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPERADMIN_ORDERS_FAIL, payload: error.response?.data?.message });
  }
};

export const deleteSuperAdminOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_DELETE_ORDER_REQUEST });
    await axios.delete(`/superadmin/order/${id}`);
    dispatch({ type: SUPERADMIN_DELETE_ORDER_SUCCESS });
  } catch (error) {
    dispatch({ type: SUPERADMIN_DELETE_ORDER_FAIL, payload: error.response?.data?.message });
  }
};

export const markSellerPaid = (id) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_MARK_PAID_REQUEST });
    const { data } = await axios.put(`/superadmin/commission/pay/${id}`);
    dispatch({ type: SUPERADMIN_MARK_PAID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SUPERADMIN_MARK_PAID_FAIL, payload: error.response?.data?.message });
  }
};

export const updateCommissionRate = (productId, rate) => async (dispatch) => {
  try {
    dispatch({ type: SUPERADMIN_UPDATE_COMMISSION_REQUEST });
    await axios.put(`/superadmin/commission/product/${productId}`, { platformCommissionPercent: rate });
    dispatch({ type: SUPERADMIN_UPDATE_COMMISSION_SUCCESS });
  } catch (error) {
    dispatch({ type: SUPERADMIN_UPDATE_COMMISSION_FAIL, payload: error.response?.data?.message });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
