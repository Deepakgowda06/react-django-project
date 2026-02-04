import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../../assets/styles/Login.css'

const Login = ({ onlogin }) => {
  const [form, setform] = useState({
    username: "",
    password: ""
  })
  const [message, setmessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handelchange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError("")
    if (message) setmessage("")
  }

  const navigate = useNavigate()

  const handelsubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setmessage("")

    // Basic validation
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("http://localhost:8000/api/login/", form)
      setmessage("Login successful!")
      console.log(response.data)
      
      if (onlogin) {
        onlogin(response.data.token, response.data.userid)
      }
      
      // Optional: Redirect after successful login
      setTimeout(() => {
        navigate("/buses")
      }, 1500)
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       error.response?.data?.error || 
                       "Login failed. Please try again."
      setError(errorMsg)
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="bus-icon">🚌</span>
            <h2>BusBook</h2>
          </div>
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handelsubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handelchange}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handelchange}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Success Message */}
          {message && (
            <div className="message success">
              <span className="message-icon">✓</span>
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="message error">
              <span className="message-icon">!</span>
              {error}
            </div>
          )}
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Sign up here
            </Link>
          </p>
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-login">
            <button type="button" className="social-button google">
              <span>G</span> Google
            </button>
            <button type="button" className="social-button facebook">
              <span>f</span> Facebook
            </button>
          </div>
        </div>
      </div>

      <div className="login-side">
        <div className="side-content">
          <h3>Book Bus Tickets Easily</h3>
          <ul className="features-list">
            <li><span>✓</span> Search and compare bus routes</li>
            <li><span>✓</span> Secure online payment</li>
            <li><span>✓</span> E-tickets on your phone</li>
            <li><span>✓</span> Real-time tracking</li>
            <li><span>✓</span> 24/7 Customer support</li>
          </ul>
          <div className="testimonial">
            <p>"Best bus booking platform I've used. Simple and reliable!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div>
                <strong>John Smith</strong>
                <span>Regular Traveler</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login