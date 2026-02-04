import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/landingpage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  
  const [counters, setCounters] = useState({
    buses: 0,
    cities: 0,
    satisfaction: 0,
    support: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targets = { 
      buses: 5000, 
      cities: 250, 
      satisfaction: 98, 
      support: 24 
    };
    
    const durations = { 
      buses: 1000, 
      cities: 800, 
      satisfaction: 600, 
      support: 400 
    };

    Object.keys(targets).forEach(key => {
      const target = targets[key];
      const duration = durations[key];
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCounters(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, 16);
    });
  }, [isVisible]);

  return (
    <div className="landing-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-icon">🚌</span>
            <h1 className="logo-text">Bus<span className="logo-highlight">Ease</span></h1>
          </div>
          <div className="nav-buttons">
            <button className="btn btn-login" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-register" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="hero-title">
                Journey with <span className="gradient-text">Comfort</span>
              </h2>
              <p className="hero-subtitle">
                Book bus tickets easily with real-time tracking and secure payments.
                Experience hassle-free travel with our modern platform.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/buses')}>
                  Book Now
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/register')}>
                  Sign Up Free
                </button>
              </div>
              <div className="trust-indicators">
                <div className="trust-item">
                  <span className="trust-icon">⭐</span>
                  <span>4.8/5 Rating</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🔒</span>
                  <span>Secure Booking</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">🔄</span>
                  <span>Easy Cancel</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-container">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="Bus Travel"
                  className="floating-image"
                />
                <div className="image-overlay"></div>
                <div className="floating-card">
                  <div className="card-header">
                    <span className="card-badge">Popular Route</span>
                    <h4>Delhi → Mumbai</h4>
                  </div>
                  <div className="card-details">
                    <div className="detail">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">16 hrs</span>
                    </div>
                    <div className="detail">
                      <span className="detail-label">Price:</span>
                      <span className="detail-price">₹999</span>
                    </div>
                  </div>
                  <button className="card-btn">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - 4 items side by side */}
        <section className="features-section">
          <h2 className="section-title">Why Choose BusEase</h2>
          <p className="section-subtitle">Features for better travel experience</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Search</h3>
              <p>Find buses easily</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Tickets</h3>
              <p>Digital tickets</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Live Tracking</h3>
              <p>GPS tracking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Reviews</h3>
              <p>Verified reviews</p>
            </div>
          </div>
        </section>

        {/* Stats Section - 4 items side by side */}
        <section className="stats-section" ref={statsRef}>
          <h2 className="section-title">Our Numbers</h2>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">{counters.buses.toLocaleString()}+</div>
              <p>Buses</p>
            </div>
            <div className="stat-item">
              <div className="stat-number">{counters.cities}+</div>
              <p>Cities</p>
            </div>
            <div className="stat-item">
              <div className="stat-number">{counters.satisfaction}%</div>
              <p>Satisfaction</p>
            </div>
            <div className="stat-item">
              <div className="stat-number">{counters.support}/7</div>
              <p>Support Hours</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title">3 Easy Steps</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Choose your route</p>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Select</h3>
              <p>Pick your seat</p>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Pay</h3>
              <p>Get e-ticket</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials">
          <h2 className="section-title">Traveler Reviews</h2>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Great booking experience! Real-time tracking is very useful."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SR</div>
                <div className="author-info">
                  <h4>Sarah R.</h4>
                  <p>Frequent Traveler</p>
                </div>
                <div className="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Easy to use platform. Always get my preferred seat!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MK</div>
                <div className="author-info">
                  <h4>Mike K.</h4>
                  <p>Business Traveler</p>
                </div>
                <div className="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-card">
            <h2>Ready to Travel?</h2>
            <p>Join thousands of happy travelers</p>
            <div className="cta-buttons">
              <button className="btn btn-cta" onClick={() => navigate('/register')}>
                Get Started
              </button>
              <button className="btn btn-cta-secondary" onClick={() => navigate('/buses')}>
                Browse Buses
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="main-content">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-icon">🚌</span>
                <h1 className="logo-text">Bus<span className="logo-highlight">Ease</span></h1>
              </div>
              <p>Your trusted travel partner</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li onClick={() => navigate('/buses')}>Browse Buses</li>
                <li>My Bookings</li>
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms</li>
                <li>Cancellation</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📞 +91 98765 43210</p>
              <p>✉️ support@busease.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 BusEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;