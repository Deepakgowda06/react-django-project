import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/register.css'

const Register = () => {
    const navigate = useNavigate()
    const [form, setform] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [message, setmessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    let handelchange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handelsubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setmessage("")
        
        try {
            await axios.post("http://localhost:8000/api/register/", form)
            setmessage("Registration successful!")
            setSuccess(true)
            
            // Redirect to home page after 2 seconds
            setTimeout(() => {
                navigate('/buses')
            }, 2000)
            
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Registration failed"
            setmessage(errorMsg)
            setSuccess(false)
            
            // Shake animation for error
            const formElement = document.querySelector('.register-card')
            formElement.classList.add('shake')
            setTimeout(() => {
                formElement.classList.remove('shake')
            }, 500)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-container">
            {/* Animated background */}
            <div className="background-shapes">
                <div className="shape shape1"></div>
                <div className="shape shape2"></div>
                <div className="shape shape3"></div>
                <div className="shape shape4"></div>
            </div>

            <div className="register-wrapper">
                <div className="register-card">
                    {/* Logo Section */}
                    <div className="logo-section">
                        <div className="logo-icon">🚌</div>
                        <h1 className="logo-text">Join Bus<span className="highlight">Ease</span></h1>
                        <p className="logo-subtitle">Create your account and start your journey</p>
                    </div>

                    {/* Success Animation */}
                    {success && (
                        <div className="success-animation">
                            <div className="checkmark">
                                <div className="checkmark-circle"></div>
                                <div className="checkmark-stem"></div>
                                <div className="checkmark-kick"></div>
                            </div>
                            <p className="success-message">Registration Successful!</p>
                        </div>
                    )}

                    {/* Message Display */}
                    {message && (
                        <div className={`message ${success ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handelsubmit} className={`register-form ${success ? 'hidden' : ''}`}>
                        <div className="form-group">
                            <label htmlFor="username" className="floating-label">
                                <span className="label-icon">👤</span>
                                Username
                            </label>
                            <input 
                                type="text" 
                                id="username"
                                name="username"  
                                value={form.username}
                                onChange={handelchange}
                                required
                                className="form-input"
                                placeholder=" "
                                autoComplete="off"
                            />
                            <div className="input-line"></div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="floating-label">
                                <span className="label-icon">✉️</span>
                                Email
                            </label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                value={form.email}
                                onChange={handelchange}
                                required
                                className="form-input"
                                placeholder=" "
                                autoComplete="off"
                            />
                            <div className="input-line"></div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="floating-label">
                                <span className="label-icon">🔒</span>
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                value={form.password}
                                onChange={handelchange}
                                required
                                className="form-input"
                                placeholder=" "
                                minLength="6"
                            />
                            <div className="input-line"></div>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">🚀</span>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="login-link">
                        <p>Already have an account? <span onClick={() => navigate('/login')}>Login here</span></p>
                    </div>

                    {/* Terms */}
                    <div className="terms">
                        <p>By registering, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span></p>
                    </div>
                </div>

                {/* Decorative side */}
                <div className="decorative-side">
                    <div className="decorative-content">
                        <h2>Start Your Journey</h2>
                        <div className="benefits">
                            <div className="benefit">
                                <span className="benefit-icon">🎯</span>
                                <span>Easy Booking</span>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">🔒</span>
                                <span>Secure Payments</span>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">⭐</span>
                                <span>Best Prices</span>
                            </div>
                            <div className="benefit">
                                <span className="benefit-icon">🔄</span>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                        <div className="travel-image">
                            <div className="image-container">
                                {/* You can add an image here or keep it as is */}
                                <div className="bus-animation">
                                    <div className="bus">🚌</div>
                                    <div className="road"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register