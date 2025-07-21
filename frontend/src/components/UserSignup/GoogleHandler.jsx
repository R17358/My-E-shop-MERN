

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleLoginUser } from "../../actions/userAction";

const GoogleHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.user);

  console.log(isAuthenticated, state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      dispatch(googleLoginUser());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  // Wait until Redux reflects the new login state
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // 👈 only navigate once Redux confirms login
    }
  }, [isAuthenticated, navigate]);

  return <h2>Logging in via Google...</h2>;
};

export default GoogleHandler;
