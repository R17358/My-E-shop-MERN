import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./SellerOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Sun, Moon, Eye, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import axios from "axios";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [subOrders, setSubOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    orderCount: 0
  });

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        };
        
        const { data } = await axios.get("/api/seller/orders", config);
        
        setSubOrders(data.subOrders || []);
        setStats({
          totalEarnings: data.totalEarnings || 0,
          pendingEarnings: data.pendingEarnings || 0,
          orderCount: data.orderCount || 0
        });
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, []);

  const columns = [
    { 
      field: "id", 
      headerName: "SubOrder ID", 
      minWidth: 250, 
      flex: 0.8 
    },
    {
      field: "customer",
      headerName: "Customer",
      minWidth: 180,
      flex: 0.5,
    },
    {
      field: "items",
      headerName: "Items",
      type: "number",
      minWidth: 100,
      flex: 0.3,
    },
    {
      field: "earnings",
      headerName: "Earnings",
      type: "number",
      minWidth: 150,
      flex: 0.4,
      cellClassName: "earnings-cell"
    },
    {
      field: "commission",
      headerName: "Commission",
      type: "number",
      minWidth: 130,
      flex: 0.4,
      cellClassName: "commission-cell"
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "status-delivered"
          : "status-processing";
      },
    },
    {
      field: "payment",
      headerName: "Payment",
      minWidth: 130,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "payment") === "Completed"
          ? "payment-completed"
          : "payment-pending";
      },
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 100,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/seller/order/${params.getValue(params.id, "id")}`}>
            <button className="view-btn" title="View Details">
              <Eye size={16} />
            </button>
          </Link>
        );
      },
    },
  ];

  const rows = [];

  subOrders &&
    subOrders.forEach((subOrder) => {
      rows.push({
        id: subOrder._id,
        customer: subOrder.customer?.name || "Unknown",
        items: subOrder.orderItems?.length || 0,
        earnings: `₹${subOrder.sellerEarnings?.toFixed(2) || 0}`,
        commission: `₹${subOrder.platformCommission?.toFixed(2) || 0}`,
        status: subOrder.orderStatus || "Processing",
        payment: subOrder.paymentStatus || "Pending",
      });
    });

  return (
    <Fragment>
      <div className="seller-orders-wrapper">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="seller-orders-hero">
          <div className="hero-icon">
            <ShoppingBag size={48} />
          </div>
          <h1 className="hero-title">My Orders</h1>
          <p className="hero-subtitle">Manage and fulfill your customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon earnings-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Earnings</p>
              <h3 className="stat-value">₹{stats.totalEarnings.toFixed(2)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pending Earnings</p>
              <h3 className="stat-value">₹{stats.pendingEarnings.toFixed(2)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders-icon">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Orders</p>
              <h3 className="stat-value">{stats.orderCount}</h3>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading your orders...</p>
          </div>
        ) : subOrders && subOrders.length > 0 ? (
          <div className="seller-orders-container">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="seller-orders-table"
              autoHeight
            />
          </div>
        ) : (
          <div className="no-orders-state">
            <ShoppingBag size={64} />
            <h3>No Orders Yet</h3>
            <p>Orders from customers will appear here</p>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default SellerOrders;
