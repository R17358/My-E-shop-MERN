import React from 'react'
import { Link } from 'react-router-dom'
import './About.css'

function Contact() {
  return (
   <>
    <div className="aboutMain">
      <div className="info">
        <h1>Ritesh Pandit</h1>
        <h3>karanstdio1234@gmail.com</h3>
        <Link to="https://www.youtube.com/@CalmifyStreet"><h3>YouTube</h3></Link>
        <Link to="https://www.linkedin.com/in/ritesh-pandit-408557269/"><h3>LinkedIn</h3></Link>
        <Link to="https://github.com/R17358">GitHub</Link>
      </div>
    </div>
   </>
  )
}

export default Contact