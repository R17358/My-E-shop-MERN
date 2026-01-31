import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/userAction'
import { Link, useNavigate } from 'react-router-dom';
import './AuthForms.css'
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';

function UserSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
        setEmail('');
        setPassword('');
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <LogIn size={40} className="auth-icon" />
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        <LogIn size={18} />
                        <span>Sign In</span>
                    </button>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <button
                        type="button"
                        className="google-btn"
                        onClick={() => {
                            window.open("https://my-e-shop-mern.onrender.com/api/v1/auth/google", "_self");
                        }}
                    >
                        <Chrome size={20} />
                        <span>Continue with Google</span>
                    </button>

                    <div className="auth-footer">
                        <span>Don't have an account?</span>
                        <Link to="/register">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserSignIn