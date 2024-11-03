import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Icon.css'
import { useSelector } from 'react-redux'

function Icon() {

  const {isAuthenticated, user} = useSelector((state) => state.user);
  const isAdmin = ()=>{
    if(user.role === "admin")
      return true;
    else
      return false;
  }
  return (
    <div className='icon'>
       {isAuthenticated ? (
            <div className="welcome-message">
                <h1>Welcome, {user?.name || 'User'}!</h1>
                <div className="subsection">
                  <div className="admin">
                      {
                        isAdmin()?(
                          <Link to="/admin"><button>Admin | Seller</button></Link>
                        ):(
                          <br />
                        )
                      }
                  </div>
                  <div className="myOrders">
                    <Link to="/myorders"><button>My Orders</button></Link>
                  </div>
                  <div className="logout">
                      <Link to="/logout"><button>LogOut</button></Link>
                  </div>
                </div>
            </div>
        ) : (
            <>
                <div className="mess">
                  <h1>Please SignUp Or LogIn !</h1>
                </div>
                <div className="log">
                <div className="register">
                    <Link to="/register"><button>SignUp</button></Link> 
                </div>
                <div className="login">
                    <Link to="/login"><button>LogIn</button></Link>
                </div>
                </div>
            </>
        )}
    </div>
  )
}

export default Icon