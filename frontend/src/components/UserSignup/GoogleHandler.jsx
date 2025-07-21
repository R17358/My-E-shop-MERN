import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Optional: fetch user data and store in context/state
      navigate("/"); // or wherever you want to go
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <h2>Logging in via Google...</h2>;
};

export default GoogleHandler;
