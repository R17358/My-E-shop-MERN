import React from "react";
import { Instagram, Youtube, Facebook, Download } from "lucide-react";
import playStore from "./googlePlay.png";
import appStore from "./appStore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Download Our App</h3>
          <p>Get exclusive deals on Android and iOS</p>
          <div className="app-buttons">
            <a href="#" className="app-link">
              <img src={playStore} alt="Google Play" />
            </a>
            <a href="#" className="app-link">
              <img src={appStore} alt="App Store" />
            </a>
          </div>
        </div>

        <div className="footer-section footer-center">
          <h1>My E-Shop</h1>
          <p>Quality is our first priority</p>
          <p className="copyright">© 2026 My E-Shop. All rights reserved.</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="http://instagram.com/" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} />
              <span>Instagram</span>
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer">
              <Youtube size={20} />
              <span>Youtube</span>
            </a>
            <a href="http://facebook.com/" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;