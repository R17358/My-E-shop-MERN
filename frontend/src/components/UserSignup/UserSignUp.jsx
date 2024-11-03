import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {register} from '../../actions/userAction'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Profile.css'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function UserSignUp() {
 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin')
    const [cnfPass, setCnfPass] = useState('');
    
    const { isAuthenticated } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
    const newUser = { name, email, password, cnfPass, role };
    
    // Dispatch action to add the new product
    if(password === cnfPass)
        dispatch(register(newUser));
    else
        toast.error("Password Not Matched")
    
    // Clear form after submission
    setName(name);
    setEmail(email);
    setPassword('');
    setRole(role);
    setCnfPass('');
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);


    return (
        <div className="mainContainer">
            <div className="container2">
                <h1>Register User</h1>
            <form onSubmit={handleSubmit}>
        <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="User Name" 
            required 
        />
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
        <input 
            type="password" 
            value={cnfPass} 
            onChange={(e) => setCnfPass(e.target.value)} 
            placeholder="Confirm Password" 
            required 
        />
        <input 
            type="text" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            placeholder="Role: admin/user" 
            required 
        />
        <button type="submit">SignUp</button>
        <Link to="/login"><p>Already account?LogIn</p></Link>
    </form>
        </div>
        </div>
      );
}

export default UserSignUp
