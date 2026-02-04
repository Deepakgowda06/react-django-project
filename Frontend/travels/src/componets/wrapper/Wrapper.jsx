import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Footer from '../Footer/Footer'
import '../../assets/styles/Wrapper.css'

const Wrapper = ({token, handellogout, children}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const logout = () => {
        handellogout();
        navigate('/login');
    }

    // Handle scroll effect for navbar and back-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <div className={`main ${scrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="logo">
                    <Link to='/'>
                        <img src="https://cdn.vectorstock.com/i/500p/69/01/bus-logo-template-modern-travel-vector-54796901.jpg" alt="BusPro Logo" />
                        <p>Buspro</p>
                    </Link>
                </div>

                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    {token ? (
                        <>
                            <div className="login">
                                <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
                                    <button>Home</button>
                                </Link>
                                <Link to='/buses' className={location.pathname === '/buses' ? 'active' : ''}>
                                    <button>Find Buses</button>
                                </Link>
                                <Link to='/my-booking' className={location.pathname === '/my-booking' ? 'active' : ''}>
                                    <button>My Bookings</button>
                                </Link>
                                <button onClick={logout}>Logout</button>
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                                <button id='login'>Login</button>
                            </Link>
                            <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                                <button id='register'>Register</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            
            <main>{children}</main>
            
            <Footer />
            
            {/* Enhanced Back to Top Button */}
            <button 
                className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
            >
                ↑
            </button>
        </>
    )
}

export default Wrapper