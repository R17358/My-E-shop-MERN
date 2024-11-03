import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Admin.css'
import { useSelector } from 'react-redux'

function Admin() {

  const {isAuthenticated, user} = useSelector((state) => state.user);
  const isAdmin = ()=>{
    if(user.role === "admin")
      return true;
    else
      return false;
  }
  return (
    <div className='icon'>
       {isAuthenticated && isAdmin() ? (
            <div className="welcome-message">
                <h1>Welcome, {user?.name || 'User'}!</h1>
                <div className="subsection">
                  <div className="newProduct">
                      <Link to="/newproduct"><button>Create Product</button></Link>
                  </div> 
                  <div className="dashboard">
                    <Link to="/dashboard"><button>Dashboard</button></Link>
                  </div>
                  <div className="dashboard">
                    <Link to="/admin/orders"><button>Orders</button></Link>
                  </div>
                </div>
            </div>
        ) : (
            <>

            </>
        )}
    </div>
  )
}

export default Admin