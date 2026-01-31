import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'
import { Mail, User } from 'lucide-react'

function About() {
  return (
    <>
      <div className="aboutPage">
        <div className="aboutContainer">
          <div className="aboutHeader">
            <div className="aboutIcon">
              <User size={48} />
            </div>
            <h1>About Us</h1>
            <p className="aboutTagline">Bringing quality products to your doorstep</p>
          </div>

          <div className="aboutContent">
            <div className="aboutSection">
              <h2>Our Story</h2>
              <p>
                Welcome to My E-Shop! We are dedicated to providing you with the best 
                online shopping experience. Our platform offers a wide range of quality 
                products at competitive prices, ensuring customer satisfaction at every step.
              </p>
            </div>

            <div className="aboutSection">
              <h2>What We Offer</h2>
              <ul className="featureList">
                <li>Wide selection of premium products</li>
                <li>Secure and easy checkout process</li>
                <li>Fast and reliable shipping</li>
                <li>Excellent customer support</li>
                <li>Hassle-free returns and exchanges</li>
              </ul>
            </div>

            <div className="aboutSection">
              <h2>Our Mission</h2>
              <p>
                To revolutionize online shopping by providing exceptional service, 
                quality products, and a seamless user experience that exceeds customer 
                expectations every time.
              </p>
            </div>

            <div className="contactInfo">
              <div className="contactItem">
                <User size={24} />
                <div>
                  <h3>Developer</h3>
                  <p>Ritesh Pandit</p>
                </div>
              </div>
              <div className="contactItem">
                <Mail size={24} />
                <div>
                  <h3>Email</h3>
                  <a href="mailto:karanstdio1234@gmail.com">karanstdio1234@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About