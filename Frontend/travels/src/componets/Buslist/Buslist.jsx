import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaSearch, 
  FaTimes, 
  FaBus, 
  FaClock, 
  FaChair, 
  FaTag, 
  FaMapMarkerAlt, 
  FaFilter,
  FaStar,
  FaFire
} from 'react-icons/fa';
import '../../assets/styles/Buslist.css';

const Buslist = () => {
    const [buses, setBuses] = useState([]);
    const [filter, setFilter] = useState({ 
        origin: '', 
        destination: '', 
        maxPrice: ''
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Parse URL query parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const origin = params.get('from') || '';
        const destination = params.get('to') || '';
        
        if (origin || destination) {
            setFilter(prev => ({
                ...prev,
                origin: origin,
                destination: destination
            }));
        }
    }, [location.search]);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8000/api/buses/");
                setBuses(response.data);
            } catch (error) {
                console.log('Error fetching buses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, []);

    const viewSeats = (id) => {
        navigate(`/bus/${id}`);
    };

    const clearFilters = () => {
        setFilter({
            origin: '',
            destination: '',
            maxPrice: ''
        });
    };

    // Filtered buses
    const filteredBuses = buses.filter(bus => {
        return (
            (filter.origin === '' || bus.orgin.toLowerCase().includes(filter.origin.toLowerCase())) &&
            (filter.destination === '' || bus.destination.toLowerCase().includes(filter.destination.toLowerCase())) &&
            (filter.maxPrice === '' || bus.price <= parseInt(filter.maxPrice))
        );
    });

    // Calculate popular routes
    const popularRoutes = [...new Set(buses.map(bus => 
        `${bus.orgin} → ${bus.destination}`
    ))].slice(0, 5);

    const handleQuickRoute = (route) => {
        const [origin, destination] = route.split(' → ');
        setFilter(prev => ({
            ...prev,
            origin: origin.trim(),
            destination: destination.trim()
        }));
    };

    const getBusType = (price) => price > 1000 ? 'premium' : 'standard';

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(`2000-01-01T${timeString}`);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const calculateDuration = (start, end) => {
        const startDate = new Date(`2000-01-01T${start}`);
        const endDate = new Date(`2000-01-01T${end}`);
        const diffMs = endDate - startDate;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
    };

    return (
        <div className="buslist-container">
            {/* Page Header */}
            <div className="page-header">
                <h1>Find Your Perfect Bus Journey</h1>
                <p>Search from our wide range of buses and book your seats in just a few clicks</p>
            </div>

            {/* Quick Popular Routes */}
            <div className="popular-routes-section">
                <h3><FaFire /> Popular Routes</h3>
                <div className="popular-routes">
                    {popularRoutes.map((route, index) => (
                        <button
                            key={index}
                            className="route-tag"
                            onClick={() => handleQuickRoute(route)}
                        >
                            {route}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Filter Section */}
            <div className="filter-section">
                <div className="search-boxes">
                    <div className="search-box">
                        <FaMapMarkerAlt className="search-icon" />
                        <input
                            type="text"
                            placeholder="From"
                            value={filter.origin}
                            onChange={(e) => setFilter({ ...filter, origin: e.target.value })}
                        />
                    </div>
                    <div className="search-box">
                        <FaMapMarkerAlt className="search-icon" />
                        <input
                            type="text"
                            placeholder="To"
                            value={filter.destination}
                            onChange={(e) => setFilter({ ...filter, destination: e.target.value })}
                        />
                    </div>
                    <div className="search-box">
                        <FaTag className="search-icon" />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filter.maxPrice}
                            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                            min="0"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    <button className="clear-btn" onClick={clearFilters}>
                        <FaTimes /> Clear Filters
                    </button>
                    <button className="search-btn">
                        <FaSearch /> Search Buses
                    </button>
                </div>
            </div>

            {/* Results Count */}
            {!loading && (
                <div className="results-count">
                    <span className="count-badge">
                        {filteredBuses.length} {filteredBuses.length === 1 ? 'Bus' : 'Buses'} Found
                    </span>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="loading">
                    <div className="bus-loader">
                        <div className="spinning-bus">🚌</div>
                        <p>Loading buses...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Bus Cards */}
                    <div className="bus-cards">
                        {filteredBuses.map((item) => {
                            const duration = calculateDuration(item.start_time, item.reach_time);
                            const isPopular = item.price > 800;
                            const busType = getBusType(item.price);
                            
                            return (
                                <div key={item.id} className="bus-card">
                                    {/* Popular Tag */}
                                    {isPopular && (
                                        <div className="popular-tag">
                                            <FaStar /> Popular
                                        </div>
                                    )}
                                    
                                    {/* Bus Type Badge */}
                                    <div className={`bus-type-badge ${busType}`}>
                                        {busType.toUpperCase()}
                                    </div>

                                    {/* Bus Header */}
                                    <div className="bus-header">
                                        <h2>
                                            <FaBus /> {item.bus_name}
                                        </h2>
                                        <span className="bus-number">
                                            #{item.bus_number}
                                        </span>
                                    </div>

                                    {/* Route Info */}
                                    <div className="route-info">
                                        <div className="origin">
                                            <span className="city">{item.orgin}</span>
                                            <span className="time">
                                                {formatTime(item.start_time)}
                                            </span>
                                        </div>
                                        <div className="route-duration">
                                            <span className="duration">{duration}</span>
                                            <div className="route-line"></div>
                                        </div>
                                        <div className="destination">
                                            <span className="city">{item.destination}</span>
                                            <span className="time">
                                                {formatTime(item.reach_time)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    {item.features && (
                                        <div className="features">
                                            <h4><FaTag /> Amenities</h4>
                                            <div className="features-list">
                                                {item.features.split(',').map((feature, idx) => (
                                                    <span key={idx} className="feature-tag">
                                                        {feature.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bus Details */}
                                    <div className="bus-details">
                                        <div className="detail-item">
                                            <FaChair className="detail-icon" />
                                            <span className="detail-label">Seats Available</span>
                                            <span className="detail-value seats-available">
                                                {item.no_of_seats}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <FaClock className="detail-icon" />
                                            <span className="detail-label">Duration</span>
                                            <span className="detail-value">{duration}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FaBus className="detail-icon" />
                                            <span className="detail-label">Bus Type</span>
                                            <span className="detail-value">{busType}</span>
                                        </div>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="price-section">
                                        <div className="price-info">
                                            <div className="price">
                                                ₹{item.price}
                                            </div>
                                            <span className="price-note">
                                                per seat • Free cancellation
                                            </span>
                                        </div>
                                        <button 
                                            className="view-btn"
                                            onClick={() => viewSeats(item.id)}
                                        >
                                            Select Seats
                                            <span className="arrow">→</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* No Results */}
                    {filteredBuses.length === 0 && !loading && (
                        <div className="no-buses">
                            <div className="no-buses-icon">🚌</div>
                            <h3>No buses found</h3>
                            <p>Try adjusting your filters or search for different routes</p>
                            <button className="clear-btn" onClick={clearFilters}>
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Tips Section */}
            {!loading && filteredBuses.length > 0 && (
                <div className="tips-section">
                    <h3>💡 Travel Tips</h3>
                    <div className="tips-grid">
                        <div className="tip-card">
                            <h4>Book in Advance</h4>
                            <p>Get better prices by booking your tickets 2-3 days before travel.</p>
                        </div>
                        <div className="tip-card">
                            <h4>Choose Premium</h4>
                            <p>Premium buses offer better comfort and amenities for longer journeys.</p>
                        </div>
                        <div className="tip-card">
                            <h4>Check Reviews</h4>
                            <p>Look for buses with good ratings for a better travel experience.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Buslist;