import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { toast } from "react-toastify";
import { Sun, Moon, Edit, Trash2, ShoppingBag } from 'lucide-react';

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const { error, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const deleteOrderHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      dispatch(deleteOrder(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <div className="action-buttons">
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <button className="edit-btn" title="Edit Order">
                <Edit size={16} />
              </button>
            </Link>

            <button
              className="delete-btn"
              onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}
              title="Delete Order"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <div className="order-list-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="order-list-hero">
          <div className="hero-icon">
            <ShoppingBag size={48} />
          </div>
          <h1 className="hero-title">All Orders</h1>
          <p className="hero-subtitle">Manage and track all customer orders</p>
        </div>

        {orders && orders.length > 0 ? (
          <div className="order-list-container">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="order-list-table"
              autoHeight
            />
          </div>
        ) : (
          <div className="no-orders-state">
            <ShoppingBag size={64} />
            <h3>No Orders Yet</h3>
            <p>Orders will appear here once customers start placing them</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default OrderList;