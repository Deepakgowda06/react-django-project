import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaTicketAlt, 
  FaBus, 
  FaUser, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock,
  FaChair,
  FaRupeeSign,
  FaDownload,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSync,
  FaFilter,
  FaSortAmountDown,
  FaPrint,
  FaShareAlt,
  FaInfoCircle
} from 'react-icons/fa'
import '../../assets/styles/Booking.css'

const Booking = ({ token, userid }) => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all') // all, active, cancelled
    const [sortBy, setSortBy] = useState('newest') // newest, oldest, price
    const [refreshing, setRefreshing] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)
    
    const navigate = useNavigate()

    useEffect(() => {
        fetchBookings()
    }, [userid, token])

    const fetchBookings = async () => {
        if (!token || !userid) {
            setError("Please login to view bookings")
            setLoading(false)
            return
        }
        
        try {
            setLoading(true)
            const response = await axios.get(
                `http://localhost:8000/api/user/${userid}/bookings/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            console.log("Booking data:", response.data)
            setBookings(response.data)
            setError(null)
        } catch (error) {
            console.log("Booking history error:", error)
            setError(error.response?.data?.message || "Failed to load bookings")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchBookings()
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return dateString
        }
    }

    const getStatus = (booking) => {
        // Check if booking is cancelled (you might need to adjust this logic)
        if (booking.status === 'cancelled' || booking.is_cancelled) {
            return 'cancelled'
        }
        
        // Check if journey date is in the past
        const journeyDate = booking.journey_date || booking.departure_time || booking.booking_time
        if (journeyDate && new Date(journeyDate) < new Date()) {
            return 'completed'
        }
        
        return 'active'
    }

    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            return
        }

        try {
            await axios.delete(
                `http://localhost:8000/api/booking/${bookingId}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            
            // Update booking status locally
            setBookings(prev => prev.map(book => 
                book.id === bookingId 
                    ? { ...book, status: 'cancelled', is_cancelled: true }
                    : book
            ))
            
            alert("Booking cancelled successfully! Refund will be processed within 3-5 business days.")
        } catch (error) {
            alert(error.response?.data?.error || "Failed to cancel booking")
        }
    }

    const downloadTicket = (booking) => {
        // Simulate ticket download
        const ticketContent = `
            BUS TICKET
            ===========
            Ticket ID: ${booking.id}
            Passenger: ${booking.user}
            Bus: ${booking.bus}
            Seat: ${booking.seat}
            Date: ${formatDate(booking.booking_time)}
            Status: Confirmed
            ===========
            Thank you for choosing BusPro!
        `
        
        const blob = new Blob([ticketContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ticket-${booking.id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        alert("Ticket downloaded successfully!")
    }

    const printTicket = (booking) => {
        setSelectedBooking(booking)
        setTimeout(() => {
            window.print()
        }, 100)
    }

    const shareBooking = async (booking) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `My Bus Booking - ${booking.bus}`,
                    text: `I've booked seat ${booking.seat} on ${booking.bus}`,
                    url: window.location.href,
                })
            } catch (error) {
                console.log('Sharing cancelled:', error)
            }
        } else {
            // Fallback: Copy to clipboard
            const text = `Booking Details:
            Bus: ${booking.bus}
            Seat: ${booking.seat}
            Date: ${formatDate(booking.booking_time)}
            Booking ID: ${booking.id}`
            
            navigator.clipboard.writeText(text)
            alert("Booking details copied to clipboard!")
        }
    }

    // Filter and sort bookings
    const filteredBookings = bookings
        .filter(booking => {
            const status = getStatus(booking)
            if (filter === 'all') return true
            return status === filter
        })
        .sort((a, b) => {
            switch(sortBy) {
                case 'newest':
                    return new Date(b.booking_time) - new Date(a.booking_time)
                case 'oldest':
                    return new Date(a.booking_time) - new Date(b.booking_time)
                case 'price':
                    return (b.price || 0) - (a.price || 0)
                default:
                    return 0
            }
        })

    // Calculate statistics
    const stats = {
        total: bookings.length,
        active: bookings.filter(b => getStatus(b) === 'active').length,
        completed: bookings.filter(b => getStatus(b) === 'completed').length,
        cancelled: bookings.filter(b => getStatus(b) === 'cancelled').length,
        totalSpent: bookings.reduce((sum, b) => sum + (b.price || 0), 0)
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'active': return <FaCheckCircle className="status-icon active" />
            case 'completed': return <FaCheckCircle className="status-icon completed" />
            case 'cancelled': return <FaTimes className="status-icon cancelled" />
            default: return <FaInfoCircle className="status-icon" />
        }
    }

    if (loading && !refreshing) {
        return (
            <div className="booking-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="booking-container">
                <div className="error-container">
                    <FaExclamationTriangle className="error-icon" />
                    <h3>Unable to Load Bookings</h3>
                    <p>{error}</p>
                    {!token && (
                        <button 
                            className="login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Login to View Bookings
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="booking-container">
            {/* Header */}
            <div className="booking-header">
                <div className="header-main">
                    <h1><FaTicketAlt /> My Bookings</h1>
                    <div className="header-actions">
                        <button 
                            className="refresh-btn"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <FaSync className={refreshing ? 'spinning' : ''} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <a href="/buses" className="book-more-btn">
                            Book More Tickets
                        </a>
                    </div>
                </div>
                
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-label">Total Bookings</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Active</span>
                        <span className="stat-value active">{stats.active}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value completed">{stats.completed}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Total Spent</span>
                        <span className="stat-value price">₹{stats.totalSpent}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="controls-section">
                <div className="filters">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Bookings ({stats.total})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        <FaCheckCircle /> Active ({stats.active})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({stats.completed})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setFilter('cancelled')}
                    >
                        <FaTimes /> Cancelled ({stats.cancelled})
                    </button>
                </div>
                
                <div className="sort-section">
                    <FaSortAmountDown />
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price">Price (High to Low)</option>
                    </select>
                </div>
            </div>

            {/* Bookings Grid */}
            {filteredBookings.length === 0 ? (
                <div className="no-bookings">
                    <div className="no-bookings-icon">
                        <FaTicketAlt />
                    </div>
                    <h3>No Bookings Found</h3>
                    <p>{
                        filter === 'all' 
                            ? "You haven't made any bookings yet. Book your first seat!"
                            : `No ${filter} bookings found.`
                    }</p>
                    <button 
                        className="browse-buses-btn"
                        onClick={() => navigate('/buses')}
                    >
                        Browse Available Buses
                    </button>
                </div>
            ) : (
                <div className="bookings-grid">
                    {filteredBookings.map((booking) => {
                        const status = getStatus(booking)
                        return (
                            <div key={booking.id} className="booking-card">
                                {/* Card Header */}
                                <div className="booking-card-header">
                                    <div className="booking-id">
                                        <span className="booking-number">#{booking.id}</span>
                                        <span className="booking-time">
                                            <FaCalendarAlt /> {formatDate(booking.booking_time)}
                                        </span>
                                    </div>
                                    <div className={`status-badge ${status}`}>
                                        {getStatusIcon(status)}
                                        <span>{status.toUpperCase()}</span>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="booking-details">
                                    <div className="detail-section">
                                        <div className="detail-item">
                                            <FaBus className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Bus</span>
                                                <h4 className="detail-value">{booking.bus || 'N/A'}</h4>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-item">
                                            <FaChair className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Seat Number</span>
                                                <h3 className="seat-number">{booking.seat}</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-item">
                                            <FaUser className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Passenger</span>
                                                <p className="detail-value">{booking.user}</p>
                                            </div>
                                        </div>
                                        
                                        {booking.price && (
                                            <div className="detail-item">
                                                <FaRupeeSign className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">Price</span>
                                                    <p className="detail-value price">₹{booking.price}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Additional Info */}
                                    <div className="additional-info">
                                        {booking.departure_time && (
                                            <div className="info-tag">
                                                <FaClock /> Departure: {formatDate(booking.departure_time)}
                                            </div>
                                        )}
                                        {booking.route && (
                                            <div className="info-tag">
                                                <FaMapMarkerAlt /> Route: {booking.route}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="booking-actions">
                                    {status === 'active' && (
                                        <>
                                            <button 
                                                className="action-btn download-btn"
                                                onClick={() => downloadTicket(booking)}
                                            >
                                                <FaDownload /> Download
                                            </button>
                                            <button 
                                                className="action-btn print-btn"
                                                onClick={() => printTicket(booking)}
                                            >
                                                <FaPrint /> Print
                                            </button>
                                            <button 
                                                className="action-btn share-btn"
                                                onClick={() => shareBooking(booking)}
                                            >
                                                <FaShareAlt /> Share
                                            </button>
                                            <button 
                                                className="action-btn cancel-btn"
                                                onClick={() => cancelBooking(booking.id)}
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        </>
                                    )}
                                    {status === 'completed' && (
                                        <button 
                                            className="action-btn completed-btn"
                                            onClick={() => alert('Journey completed successfully!')}
                                        >
                                            <FaCheckCircle /> Completed
                                        </button>
                                    )}
                                    {status === 'cancelled' && (
                                        <button 
                                            className="action-btn cancelled-btn"
                                            disabled
                                        >
                                            <FaTimes /> Cancelled
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Print Ticket Modal */}
            {selectedBooking && (
                <div className="print-ticket" id="print-ticket">
                    <div className="ticket-header">
                        <h2>BusPro Ticket</h2>
                        <div className="ticket-id">Ticket #{selectedBooking.id}</div>
                    </div>
                    
                    <div className="ticket-body">
                        <div className="ticket-section">
                            <h3>Passenger Details</h3>
                            <p><strong>Name:</strong> {selectedBooking.user}</p>
                            <p><strong>Booking Date:</strong> {formatDate(selectedBooking.booking_time)}</p>
                        </div>
                        
                        <div className="ticket-section">
                            <h3>Journey Details</h3>
                            <p><strong>Bus:</strong> {selectedBooking.bus}</p>
                            <p><strong>Seat:</strong> {selectedBooking.seat}</p>
                            {selectedBooking.departure_time && (
                                <p><strong>Departure:</strong> {formatDate(selectedBooking.departure_time)}</p>
                            )}
                        </div>
                        
                        <div className="ticket-section">
                            <h3>Important Information</h3>
                            <ul>
                                <li>Please arrive at least 30 minutes before departure</li>
                                <li>Carry valid ID proof</li>
                                <li>Show this ticket at boarding</li>
                                <li>Ticket valid only for the booked passenger</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="ticket-footer">
                        <div className="barcode">||| ||| ||| ||| ||| |||</div>
                        <p>Thank you for choosing BusPro!</p>
                        <p>Customer Support: 1800-123-4567</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Booking