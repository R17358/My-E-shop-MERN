import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {register} from '../../actions/userAction'
import { Link, useNavigate } from 'react-router-dom';
import './AuthForms.css'
import { toast } from 'react-toastify';
import { User, Mail, Lock, Shield, UserPlus } from 'lucide-react';

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
        
        if(password === cnfPass) {
            dispatch(register(newUser));
        } else {
            toast.error("Passwords do not match")
        }
        
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
        <div className="auth-container">
            <div className="auth-card signup-card">
                <div className="auth-header">
                    <UserPlus size={40} className="auth-icon" />
                    <h1>Create Account</h1>
                    <p>Sign up to get started</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">
                            <User size={16} />
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter your name" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            <Mail size={16} />
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your email" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <Lock size={16} />
                            Password
                        </label>
                        <input
                            id="password"
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Create a password" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <Lock size={16} />
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password" 
                            value={cnfPass} 
                            onChange={(e) => setCnfPass(e.target.value)} 
                            placeholder="Confirm your password" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            <Shield size={16} />
                            Account Type
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="role-select"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin/Seller</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        <UserPlus size={18} />
                        <span>Create Account</span>
                    </button>

                    <div className="auth-footer">
                        <span>Already have an account?</span>
                        <Link to="/login">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserSignUp