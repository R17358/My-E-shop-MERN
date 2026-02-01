import React, { useEffect, useState } from 'react'
import './App.css'
import store from "./store"
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Icon from './components/Icon/Icon'
import UserSignUp from './components/UserSignup/UserSignUp'
import UserLogin from './components/UserSignup/UserSignIn'
import Profile from './components/CreateProduct/Profile'
import { ToastContainer } from "react-toastify";
import ProductPage from './pages/ProductPage'
import LogOut from './components/LogOut/LogOut'
import Admin from './components/Admin/Admin'
import Dashboard from './components/dashboard/Dashboard'
import ProductDetails from './components/ProductDetail/ProductDetails'
import Cart from './components/Cart/Cart'
import Shipping from './components/Cart/Shipping'
import ConfirmOrder from './components/Cart/ConfirmOrder'
import OrderSuccess from './components/Cart/OrderSuccess'
import Payment from './components/Cart/Payment'
import ProcessOrder from './components/Admin/ProcessOrder'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyOrders from './components/Order/MyOrders'
import OrderDetails from './components/Order/OrderDetails'
import OrderList from './components/Admin/OrderList'
import GoogleHandler from './pages/GoogleHandler'
import UpdateProduct from './components/dashboard/UpdateProduct'
import { Sun, Moon } from 'lucide-react';

// NEW SELLER COMPONENTS
import SellerDashboard from './components/Seller/SellerDashboard'
import SellerOrders from './components/Seller/SellerOrders'

const stripePromise = loadStripe("pk_test_51OwJJmSHX593TEEJrYWld45sj3BcosNHNIL34PloU37MsGRNowQKqriEIukMTFjfSNZwkyo41i0S71xR5YVEJdoo00viuK9qkO");

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Set theme on initial load and whenever it changes
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <ToastContainer position="top-right" autoClose={2000} />
        
        {/* Global Theme Toggle Button */}
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
               
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/products/:keyword" element={<ProductPage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/icon" element={<Icon/>} />
          <Route path="/register" element={<UserSignUp/>} />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/logout" element={<LogOut/>} />
          <Route path="/product/:id" element={<ProductDetails/>} />
          <Route path="/login/success" element={<GoogleHandler />} />

          {/* Cart & Orders Routes */}
          <Route path="/cart" element={<Cart/>} />
          <Route path="/shipping" element={<Shipping/>} />
          <Route path="/order/confirm" element={<ConfirmOrder/>} />
          <Route path="/success" element={<OrderSuccess/>} />
          <Route path="/process/payment" element={
            <Elements stripe={stripePromise}>
              <Payment />
            </Elements>
          } />
          <Route path="/myorders" element={<MyOrders/>} />
          <Route path="/order/:id" element={<OrderDetails/>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin/>} />
          <Route path="/admin/orders" element={<OrderList/>} />
          <Route path="/admin/order/:id" element={<ProcessOrder/>} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />

          {/* Seller Routes - NEW */}
          <Route path="/seller/dashboard" element={<SellerDashboard/>} />
          <Route path="/seller/orders" element={<SellerOrders/>} />
          <Route path="/seller/products" element={<Dashboard/>} /> {/* Reuse existing Dashboard */}
          <Route path="/seller/product/new" element={<Profile/>} /> {/* Reuse existing Profile/CreateProduct */}
          <Route path="/seller/product/:id" element={<UpdateProduct/>} /> {/* Reuse existing UpdateProduct */}

          {/* Legacy Routes (keeping for backward compatibility) */}
          <Route path="/newproduct" element={<Profile/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>

        <Footer />
      </Router>
    </Provider>
  )
}

export default App
//4000003560000008

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Set theme on initial load and whenever it changes
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
      <Provider store={store}>
          <Router>
          <Header />
          <ToastContainer position="top-right" autoClose={2000} />
          
          {/* Global Theme Toggle Button */}
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
                 
              <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/products" element={<ProductPage/>} />
                  <Route path="/products/:keyword" element={<ProductPage/>} />
                  <Route path="/about" element={<About/>} />
                  <Route path="/contact" element={<Contact/>} />
                  <Route path="/icon" element={<Icon/>} />
                  <Route path="/register" element={<UserSignUp/>} />
                  <Route path="/login" element={<UserLogin/>} />
                  <Route path="/newproduct" element={<Profile/>} />
                  <Route path="/logout" element={<LogOut/>} />
                  <Route path="/admin" element={<Admin/>} />
                  <Route path="/dashboard" element={<Dashboard/>} />
                  <Route path="/product/:id" element={<ProductDetails/>} />
                  <Route path="/cart" element={<Cart/>} />
                  <Route path="/shipping" element={<Shipping/>} />
                  <Route path="/order/confirm" element={<ConfirmOrder/>} />
                  <Route path="/success" element={<OrderSuccess/>} />
                  <Route path="/process/payment" element={
                  <Elements stripe={stripePromise}>
                    <Payment />
                  </Elements>
                } />
                <Route path="/myorders" element={<MyOrders/>} />
                <Route path="/order/:id" element={<OrderDetails/>} />
                <Route path="/admin/orders" element={<OrderList/>} />
                <Route path="/admin/order/:id" element={<ProcessOrder/>} />
                 <Route path="/login/success" element={<GoogleHandler />} />
                 <Route path="/admin/product/:id" element={<UpdateProduct />} />
              </Routes>
            <Footer />
          </Router>
      </Provider>
  )
}

export default App
