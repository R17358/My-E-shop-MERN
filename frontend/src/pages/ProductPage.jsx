import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Product from "../components/productCard/Product";
import Loader from "../components/Loader/Loader";
import { getProduct } from "../actions/productAction";
import "./Home.css";

function ProductPage() {
  const dispatch = useDispatch();
  const { keyword } = useParams();

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

  // Reset page when keyword changes
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1>All Products</h1>

      <div className="container">
        {products.length > 0 ? (
          products.map((product) => (
            <Product key={product._id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Pagination */}
      {resultPerPage < filteredProductsCount && (
        <div className="paginationBox">
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
