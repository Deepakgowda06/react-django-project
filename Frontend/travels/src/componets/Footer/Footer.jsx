import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../../assets/styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Company Info */}
                <div className="footer-section">
                    <div className="footer-logo">
                        <img 
                            src="https://cdn.vectorstock.com/i/500p/69/01/bus-logo-template-modern-travel-vector-54796901.jpg" 
                            alt="BusPro Logo" 
                        />
                        <h3>BusPro</h3>
                    </div>
                    <p className="footer-description">
                        Your trusted partner for comfortable and reliable bus travel experiences.
                        Book your journey with us for the best prices and premium service.
                    </p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/buses">Find Buses</Link></li>
                        <li><Link to="/my-booking">My Bookings</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Popular Routes */}
                <div className="footer-section">
                    <h4>Popular Routes</h4>
                    <ul className="footer-links">
                        <li><Link to="/buses?from=Delhi&to=Jaipur">Delhi → Jaipur</Link></li>
                        <li><Link to="/buses?from=Mumbai&to=Pune">Mumbai → Pune</Link></li>
                        <li><Link to="/buses?from=Bangalore&to=Chennai">Bangalore → Chennai</Link></li>
                        <li><Link to="/buses?from=Kolkata&to=Darjeeling">Kolkata → Darjeeling</Link></li>
                        <li><Link to="/buses?from=Hyderabad&to=Goa">Hyderabad → Goa</Link></li>
                        <li><Link to="/buses?from=all">View All Routes</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <ul className="contact-info">
                        <li>
                            <FaMapMarkerAlt />
                            <span>123 Travel Street, City Center,<br />Metro City - 560001</span>
                        </li>
                        <li>
                            <FaPhone />
                            <span>+91 98765 43210</span>
                        </li>
                        <li>
                            <FaEnvelope />
                            <span>support@buspro.com</span>
                        </li>
                    </ul>
                    
                    <div className="newsletter">
                        <h5>Subscribe to Newsletter</h5>
                        <div className="newsletter-form">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                aria-label="Email for newsletter"
                            />
                            <button type="button">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; {currentYear} BusPro. All rights reserved.</p>
                    <div className="legal-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/cancellation">Cancellation Policy</Link>
                        <Link to="/sitemap">Sitemap</Link>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button 
                className="back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
            >
                ↑
            </button>
        </footer>
    );
};

export default Footer;