import React from 'react'
import { Link } from 'react-router-dom'
import './Contact.css'
import { Mail, User, Youtube, Linkedin, Github, MapPin, Phone } from 'lucide-react'

function Contact() {
  return (
    <>
      <div className="contactPage">
        <div className="contactContainer">
          <div className="contactHeader">
            <div className="contactIcon">
              <Mail size={48} />
            </div>
            <h1>Get In Touch</h1>
            <p className="contactTagline">We'd love to hear from you</p>
          </div>

          <div className="contactContent">
            <div className="contactIntro">
              <h2>Contact Us</h2>
              <p>
                Have questions, feedback, or need assistance? Feel free to reach out to us 
                through any of the channels below. We're here to help!
              </p>
            </div>

            <div className="contactGrid">
              <div className="contactCard">
                <div className="cardIcon">
                  <User size={32} />
                </div>
                <h3>Developer</h3>
                <p>Ritesh Pandit</p>
              </div>

              <div className="contactCard">
                <div className="cardIcon">
                  <Mail size={32} />
                </div>
                <h3>Email</h3>
                <a href="mailto:karanstdio1234@gmail.com">karanstdio1234@gmail.com</a>
              </div>

              <div className="contactCard">
                <div className="cardIcon">
                  <MapPin size={32} />
                </div>
                <h3>Location</h3>
                <p>India</p>
              </div>

              <div className="contactCard">
                <div className="cardIcon">
                  <Phone size={32} />
                </div>
                <h3>Support</h3>
                <p>Available 24/7</p>
              </div>
            </div>

            <div className="socialSection">
              <h2>Connect With Us</h2>
              <p className="socialDescription">Follow us on social media for updates and more</p>
              
              <div className="socialLinks">
                <a 
                  href="https://www.youtube.com/@CalmifyStreet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="socialLink youtube"
                >
                  <Youtube size={28} />
                  <div className="socialText">
                    <h4>YouTube</h4>
                    <p>@CalmifyStreet</p>
                  </div>
                </a>

                <a 
                  href="https://www.linkedin.com/in/ritesh-pandit-408557269/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="socialLink linkedin"
                >
                  <Linkedin size={28} />
                  <div className="socialText">
                    <h4>LinkedIn</h4>
                    <p>Connect with me</p>
                  </div>
                </a>

                <a 
                  href="https://github.com/R17358" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="socialLink github"
                >
                  <Github size={28} />
                  <div className="socialText">
                    <h4>GitHub</h4>
                    <p>@R17358</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact