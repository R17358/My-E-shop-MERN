import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Product from "../components/productCard/Product";
import Loader from "../components/Loader/Loader";
import { getProduct } from "../actions/productAction";
import { Sun, Moon, Search } from 'lucide-react';
import "./Home.css";

function ProductPage() {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const {
    products,
    loading,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getProduct(keyword, currentPage));
  }, [dispatch, keyword, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (loading) return <Loader />;

  return (
    <div className="page-wrapper">
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div className="page-hero">
        <h1 className="hero-title">
          {keyword ? `Search: "${keyword}"` : 'All Products'}
        </h1>
        <p className="hero-subtitle">
          {keyword 
            ? `${filteredProductsCount} products found`
            : `Browse our complete collection of ${productsCount} products`
          }
        </p>
      </div>

      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <div className="no-products-state">
            <Search size={48} strokeWidth={1.5} />
            <h3>No products found</h3>
            <p>Try adjusting your search or browse all products</p>
          </div>
        )}
      </div>

      {resultPerPage < filteredProductsCount && (
        <div className="pagination-container">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={filteredProductsCount}
            onChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            nextPageText="Next"
            prevPageText="Prev"
            firstPageText="First"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
        </div>
      )}
    </div>
  );
}

export default ProductPage;