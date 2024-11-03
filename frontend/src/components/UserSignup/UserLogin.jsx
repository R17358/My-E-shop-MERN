import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {login} from '../../actions/userAction'
import { Link , useNavigate} from 'react-router-dom';
import './Profile.css'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function UserSignIn() {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
    
    // Dispatch for Login
    dispatch(login(email, password));
    
    // Clear form after submission
    setEmail('');
    setPassword('');
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="mainContainer">
            <div className="container2">
                <h1>LogIn</h1>
            <form onSubmit={handleSubmit}>
    
        <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="User email" 
            required 
        />
        <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
        />

        <button type="submit">SignIn</button>
        <Link to="/register"><p>New User?SignUp</p></Link>
    </form>
        </div>
        </div>
      );
}

export default UserSignIn
