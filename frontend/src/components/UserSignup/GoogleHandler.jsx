import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLoginUser } from "../../actions/userAction";

const GoogleHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      dispatch(googleLoginUser()); 
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch]);

  return <h2>Logging in via Google...</h2>;
};

export default GoogleHandler;
