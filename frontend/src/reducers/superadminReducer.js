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
  SUPERADMIN_UPDATE_USER_RESET,
  SUPERADMIN_DELETE_USER_REQUEST,
  SUPERADMIN_DELETE_USER_SUCCESS,
  SUPERADMIN_DELETE_USER_FAIL,
  SUPERADMIN_DELETE_USER_RESET,
  SUPERADMIN_SELLERS_REQUEST,
  SUPERADMIN_SELLERS_SUCCESS,
  SUPERADMIN_SELLERS_FAIL,
  SUPERADMIN_PRODUCTS_REQUEST,
  SUPERADMIN_PRODUCTS_SUCCESS,
  SUPERADMIN_PRODUCTS_FAIL,
  SUPERADMIN_DELETE_PRODUCT_REQUEST,
  SUPERADMIN_DELETE_PRODUCT_SUCCESS,
  SUPERADMIN_DELETE_PRODUCT_FAIL,
  SUPERADMIN_DELETE_PRODUCT_RESET,
  SUPERADMIN_ORDERS_REQUEST,
  SUPERADMIN_ORDERS_SUCCESS,
  SUPERADMIN_ORDERS_FAIL,
  SUPERADMIN_DELETE_ORDER_REQUEST,
  SUPERADMIN_DELETE_ORDER_SUCCESS,
  SUPERADMIN_DELETE_ORDER_FAIL,
  SUPERADMIN_DELETE_ORDER_RESET,
  SUPERADMIN_MARK_PAID_REQUEST,
  SUPERADMIN_MARK_PAID_SUCCESS,
  SUPERADMIN_MARK_PAID_FAIL,
  SUPERADMIN_MARK_PAID_RESET,
  SUPERADMIN_UPDATE_COMMISSION_REQUEST,
  SUPERADMIN_UPDATE_COMMISSION_SUCCESS,
  SUPERADMIN_UPDATE_COMMISSION_FAIL,
  SUPERADMIN_UPDATE_COMMISSION_RESET,
  CLEAR_ERRORS,
} from "../constants/superadminConstants";

export const superadminDashboardReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPERADMIN_DASHBOARD_REQUEST:
      return { loading: true };
    case SUPERADMIN_DASHBOARD_SUCCESS:
      return { loading: false, ...action.payload };
    case SUPERADMIN_DASHBOARD_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminCommissionsReducer = (state = { subOrders: [] }, action) => {
  switch (action.type) {
    case SUPERADMIN_COMMISSIONS_REQUEST:
    case SUPERADMIN_SELLER_COMMISSIONS_REQUEST:
      return { loading: true };
    case SUPERADMIN_COMMISSIONS_SUCCESS:
    case SUPERADMIN_SELLER_COMMISSIONS_SUCCESS:
      return { loading: false, ...action.payload };
    case SUPERADMIN_COMMISSIONS_FAIL:
    case SUPERADMIN_SELLER_COMMISSIONS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case SUPERADMIN_USERS_REQUEST:
      return { loading: true };
    case SUPERADMIN_USERS_SUCCESS:
      return { loading: false, users: action.payload };
    case SUPERADMIN_USERS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminUserActionReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPERADMIN_UPDATE_USER_REQUEST:
    case SUPERADMIN_DELETE_USER_REQUEST:
      return { loading: true };
    case SUPERADMIN_UPDATE_USER_SUCCESS:
      return { loading: false, isUpdated: true };
    case SUPERADMIN_DELETE_USER_SUCCESS:
      return { loading: false, isDeleted: true };
    case SUPERADMIN_UPDATE_USER_FAIL:
    case SUPERADMIN_DELETE_USER_FAIL:
      return { loading: false, error: action.payload };
    case SUPERADMIN_UPDATE_USER_RESET:
      return { ...state, isUpdated: false };
    case SUPERADMIN_DELETE_USER_RESET:
      return { ...state, isDeleted: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminSellersReducer = (state = { sellers: [] }, action) => {
  switch (action.type) {
    case SUPERADMIN_SELLERS_REQUEST:
      return { loading: true };
    case SUPERADMIN_SELLERS_SUCCESS:
      return { loading: false, sellers: action.payload };
    case SUPERADMIN_SELLERS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminProductsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case SUPERADMIN_PRODUCTS_REQUEST:
      return { loading: true };
    case SUPERADMIN_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload };
    case SUPERADMIN_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminProductActionReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPERADMIN_DELETE_PRODUCT_REQUEST:
    case SUPERADMIN_UPDATE_COMMISSION_REQUEST:
      return { loading: true };
    case SUPERADMIN_DELETE_PRODUCT_SUCCESS:
      return { loading: false, isDeleted: true };
    case SUPERADMIN_UPDATE_COMMISSION_SUCCESS:
      return { loading: false, isUpdated: true };
    case SUPERADMIN_DELETE_PRODUCT_FAIL:
    case SUPERADMIN_UPDATE_COMMISSION_FAIL:
      return { loading: false, error: action.payload };
    case SUPERADMIN_DELETE_PRODUCT_RESET:
      return { ...state, isDeleted: false };
    case SUPERADMIN_UPDATE_COMMISSION_RESET:
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case SUPERADMIN_ORDERS_REQUEST:
      return { loading: true };
    case SUPERADMIN_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload.orders, totalRevenue: action.payload.totalRevenue };
    case SUPERADMIN_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const superadminOrderActionReducer = (state = {}, action) => {
  switch (action.type) {
    case SUPERADMIN_DELETE_ORDER_REQUEST:
    case SUPERADMIN_MARK_PAID_REQUEST:
      return { loading: true };
    case SUPERADMIN_DELETE_ORDER_SUCCESS:
      return { loading: false, isDeleted: true };
    case SUPERADMIN_MARK_PAID_SUCCESS:
      return { loading: false, isUpdated: true };
    case SUPERADMIN_DELETE_ORDER_FAIL:
    case SUPERADMIN_MARK_PAID_FAIL:
      return { loading: false, error: action.payload };
    case SUPERADMIN_DELETE_ORDER_RESET:
      return { ...state, isDeleted: false };
    case SUPERADMIN_MARK_PAID_RESET:
      return { ...state, isUpdated: false };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
