import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Header.css";

function Header() {
  const [keyword, setKeyword] = useState(""); // State for search input
  const navigate = useNavigate(); // useNavigate replaces history.push in React Router v6

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    setKeyword(e.target.value)
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else{
      navigate(`/products`);
    }
  };

  return (
    <div className="header">
      <div className="nm">My E-Shop</div>
      <div className="left">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
      <div className="right">
        <form onSubmit={searchSubmitHandler}> {/* Wrap input in form to submit on Enter */}
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search for Products...."
            value={keyword}
            onChange={(e) => searchSubmitHandler(e)} // Update keyword on input change
          />
          <Link to="/cart"><button></button></Link>
        </form>
        <Link to="/icon">   {/* Link for profile icon or login/logout */}
          <div className="profile"></div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
