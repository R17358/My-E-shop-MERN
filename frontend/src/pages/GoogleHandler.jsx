import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../actions/userAction"; // adjust if needed

const GoogleHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      dispatch(loadUser()); // loads user using token
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return <h2>Logging in via Google...</h2>;
};

export default GoogleHandler;
