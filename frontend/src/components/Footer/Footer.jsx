import React from "react";
import playStore from "./googlePlay.png";
import appStore from "./appStore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h2>DOWNLOAD OUR APP</h2>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>My E-Shop</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; MeRiteshPandit</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/">Instagram</a>
        <a href="https://studio.youtube.com/channel/UC3jrErO58aI4kiCER_cn5IQ/videos">Youtube</a>
        <a href="http://instagram.com/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
