import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaBus, FaUserCheck, FaUserTimes, FaInfoCircle, FaCouch, FaChair } from 'react-icons/fa'
import '../../assets/styles/Seats.css'

const Seats = ({ token }) => {
    const [bus, setBus] = useState(null)
    const [seats, setSeats] = useState([])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [seatsPerRow, setSeatsPerRow] = useState(5) // Default: 5 seats per row (2+3)
    const [rows, setRows] = useState(0)

    const { busid } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                setLoading(true)
                const response = await axios.get(
                    `http://localhost:8000/api/buses/${busid}/`
                )
                const busData = response.data
                setBus(busData)
                
                // Get seats array from response
                const seatsData = busData.seats || []
                setSeats(seatsData)
                
                // Calculate layout based on available seats
                calculateLayout(seatsData)
                
            } catch (error) {
                console.log("Error in fetching seats", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSeats()
    }, [busid])

    const calculateLayout = (seatsData) => {
        if (!seatsData.length) return
        
        // Find maximum seat number to determine total seats
        const maxSeatNumber = Math.max(...seatsData.map(seat => parseInt(seat.seat_number)))
        
        // Default configuration (can be adjusted based on bus type)
        let seatsInRow = 5 // 2 + 3 configuration
        let totalRows = Math.ceil(maxSeatNumber / seatsInRow)
        
        // Adjust layout based on bus capacity
        if (maxSeatNumber <= 30) {
            seatsInRow = 4 // Smaller bus (2 + 2)
        } else if (maxSeatNumber <= 45) {
            seatsInRow = 5 // Standard bus (2 + 3)
        } else {
            seatsInRow = 6 // Large bus (3 + 3)
        }
        
        totalRows = Math.ceil(maxSeatNumber / seatsInRow)
        
        setSeatsPerRow(seatsInRow)
        setRows(totalRows)
    }

    const handleSeatClick = (seat) => {
        if (seat.is_booked) return
        
        if (selectedSeats.includes(seat.id)) {
            // Deselect seat
            setSelectedSeats(prev => prev.filter(id => id !== seat.id))
        } else {
            // Select seat (limit to 6 seats)
            if (selectedSeats.length < 6) {
                setSelectedSeats(prev => [...prev, seat.id])
            } else {
                alert("You can select maximum 6 seats at a time")
            }
        }
    }

    const handleBooking = async () => {
        if (!token) {
            alert("Please login to book seats")
            navigate('/login')
            return
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat")
            return
        }

        try {
            // Book all selected seats
            await Promise.all(
                selectedSeats.map(seatId => 
                    axios.post(
                        "http://localhost:8000/api/booking/",
                        { seat_id: seatId },
                        {
                            headers: {
                                Authorization: `Token ${token}`
                            }
                        }
                    )
                )
            )
            
            setBookingSuccess(true)
            alert(`Successfully booked ${selectedSeats.length} seat(s)!`)

            // Update UI
            setSeats(prev =>
                prev.map(seat =>
                    selectedSeats.includes(seat.id) 
                        ? { ...seat, is_booked: true } 
                        : seat
                )
            )
            
            // Clear selected seats
            setSelectedSeats([])
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => setBookingSuccess(false), 3000)
            
        } catch (error) {
            alert(error.response?.data?.error || "Booking failed")
        }
    }

    // Generate seat layout dynamically
    const generateSeatLayout = () => {
        if (!seats.length) return { leftSeats: [], rightSeats: [] }
        
        // Sort seats by seat number
        const sortedSeats = [...seats].sort((a, b) => 
            parseInt(a.seat_number) - parseInt(b.seat_number)
        )
        
        // Determine left and right side based on seats per row
        let leftSeatsCount, rightSeatsCount
        
        switch(seatsPerRow) {
            case 4: // 2 + 2
                leftSeatsCount = 2
                rightSeatsCount = 2
                break
            case 5: // 2 + 3
                leftSeatsCount = 2
                rightSeatsCount = 3
                break
            case 6: // 3 + 3
                leftSeatsCount = 3
                rightSeatsCount = 3
                break
            default:
                leftSeatsCount = 2
                rightSeatsCount = 3
        }
        
        // Group seats into rows
        const leftRows = []
        const rightRows = []
        
        for (let row = 0; row < rows; row++) {
            const rowStart = row * seatsPerRow
            
            // Left side seats for this row
            const leftRowSeats = []
            for (let i = 0; i < leftSeatsCount; i++) {
                const seatIndex = rowStart + i
                if (seatIndex < sortedSeats.length) {
                    leftRowSeats.push(sortedSeats[seatIndex])
                }
            }
            leftRows.push(leftRowSeats)
            
            // Right side seats for this row
            const rightRowSeats = []
            for (let i = 0; i < rightSeatsCount; i++) {
                const seatIndex = rowStart + leftSeatsCount + i
                if (seatIndex < sortedSeats.length) {
                    rightRowSeats.push(sortedSeats[seatIndex])
                }
            }
            rightRows.push(rightRowSeats)
        }
        
        return { leftRows, rightRows }
    }

    // Calculate total price
    const totalPrice = selectedSeats.length * (bus?.price || 0)

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified'
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error) {
            return dateString
        }
    }

    const getBusLayoutType = () => {
        switch(seatsPerRow) {
            case 4: return 'Compact (2+2)'
            case 5: return 'Standard (2+3)'
            case 6: return 'Luxury (3+3)'
            default: return 'Standard'
        }
    }

    const { leftRows, rightRows } = generateSeatLayout()

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-bus">
                    <FaBus className="spinning-bus" />
                    <p>Loading bus seats...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="seats-container">
            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate('/buses')}>
                <FaArrowLeft /> Back to Buses
            </button>

            {/* Bus Header */}
            {bus && (
                <div className="bus-header">
                    <div className="bus-title">
                        <h1><FaBus /> {bus.bus_name}</h1>
                        <div className="bus-meta">
                            <span className="bus-number">#{bus.bus_number}</span>
                            <span className="bus-layout-type">
                                <FaChair /> {getBusLayoutType()} • {seats.length} Seats
                            </span>
                        </div>
                    </div>
                    
                    <div className="bus-details">
                        <div className="route-info">
                            <div className="origin">
                                <h3>{bus.orgin || 'Origin'}</h3>
                                <p>Departure: {formatDate(bus.departure_time || bus.start_time)}</p>
                            </div>
                            <div className="route-arrow">→</div>
                            <div className="destination">
                                <h3>{bus.destination || 'Destination'}</h3>
                                <p>Arrival: {formatDate(bus.reach_time)}</p>
                            </div>
                        </div>
                        
                        <div className="bus-features">
                            <span className="feature-tag"><FaCouch /> {bus.features || 'Standard Features'}</span>
                            <span className="price-tag">₹{bus.price || 0}/seat</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {bookingSuccess && (
                <div className="success-message">
                    <FaUserCheck /> Booking Successful! Seats have been reserved.
                </div>
            )}

            {/* Selected Seats Summary */}
            {selectedSeats.length > 0 && (
                <div className="selection-summary">
                    <h3><FaInfoCircle /> Selected Seats ({selectedSeats.length})</h3>
                    <div className="selected-seats-list">
                        {selectedSeats.map((seatId, index) => {
                            const seat = seats.find(s => s.id === seatId)
                            return seat ? (
                                <span key={index} className="selected-seat-tag">
                                    Seat {seat.seat_number}
                                </span>
                            ) : null
                        })}
                    </div>
                    <div className="booking-summary">
                        <p>Total Amount: <strong>₹{totalPrice}</strong></p>
                        <button className="book-btn" onClick={handleBooking}>
                            Book Now
                        </button>
                    </div>
                </div>
            )}

            {/* Bus Layout */}
            <div className="bus-layout-container">
                <div className="bus-layout">
                    {seats.length === 0 ? (
                        <div className="no-seats-available">
                            <FaUserTimes />
                            <h3>No Seats Available</h3>
                            <p>This bus doesn't have any seats configured yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bus-body">
                                <div className="seats-grid">
                                    {/* Left side seats */}
                                    <div className="seats-left">
                                        {leftRows.map((row, rowIndex) => (
                                            <div key={rowIndex} className="seat-row">
                                                {row.map(seat => {
                                                    const isSelected = selectedSeats.includes(seat.id)
                                                    return (
                                                        <button
                                                            key={seat.id}
                                                            className={`seat ${seat.is_booked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                                                            onClick={() => handleSeatClick(seat)}
                                                            disabled={seat.is_booked}
                                                            title={`Seat ${seat.seat_number} - ${seat.is_booked ? 'Booked' : 'Available'}`}
                                                        >
                                                            {seat.seat_number}
                                                            {isSelected && <span className="selected-indicator">✓</span>}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Aisle */}
                                    <div className="aisle">
                                        <div className="aisle-line"></div>
                                        <span>AISLE</span>
                                        <div className="aisle-line"></div>
                                    </div>

                                    {/* Right side seats */}
                                    <div className="seats-right">
                                        {rightRows.map((row, rowIndex) => (
                                            <div key={rowIndex} className="seat-row">
                                                {row.map(seat => {
                                                    const isSelected = selectedSeats.includes(seat.id)
                                                    return (
                                                        <button
                                                            key={seat.id}
                                                            className={`seat ${seat.is_booked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                                                            onClick={() => handleSeatClick(seat)}
                                                            disabled={seat.is_booked}
                                                            title={`Seat ${seat.seat_number} - ${seat.is_booked ? 'Booked' : 'Available'}`}
                                                        >
                                                            {seat.seat_number}
                                                            {isSelected && <span className="selected-indicator">✓</span>}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Front of Bus */}
                                <div className="bus-front">
                                    <div className="driver-cabin">
                                        <div className="steering-wheel">🚌</div>
                                        <p>Driver's Cabin</p>
                                    </div>
                                    <div className="bus-entrance">
                                        <div className="entrance-icon">🚪</div>
                                        <p>Entrance</p>
                                    </div>
                                </div>
                            </div>

                            {/* Seat Legend */}
                            <div className="seat-legend">
                                <div className="legend-item">
                                    <div className="legend-box available"></div>
                                    <span>Available ({seats.filter(s => !s.is_booked).length})</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box selected"></div>
                                    <span>Selected ({selectedSeats.length})</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box booked"></div>
                                    <span>Booked ({seats.filter(s => s.is_booked).length})</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-box aisle"></div>
                                    <span>Aisle</span>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="instructions">
                                <h4><FaInfoCircle /> How to Book:</h4>
                                <ol>
                                    <li>Click on <strong>available seats</strong> to select them</li>
                                    <li>You can select up to 6 seats at a time</li>
                                    <li>Click "Book Now" to confirm your selection</li>
                                    <li>Need to change? Click on selected seats to deselect</li>
                                </ol>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Side Panel */}
                <div className="booking-panel">
                    <h3><FaUserCheck /> Booking Summary</h3>
                    
                    <div className="summary-details">
                        <div className="detail-row">
                            <span>Bus Name:</span>
                            <strong>{bus?.bus_name}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Layout:</span>
                            <strong>{getBusLayoutType()}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Route:</span>
                            <strong>{bus?.orgin} → {bus?.destination}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Price per seat:</span>
                            <strong>₹{bus?.price || 0}</strong>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="seat-status">
                            <div className="status-item">
                                <span className="status-dot available"></span>
                                <span>Available: {seats.filter(s => !s.is_booked).length}</span>
                            </div>
                            <div className="status-item">
                                <span className="status-dot booked"></span>
                                <span>Booked: {seats.filter(s => s.is_booked).length}</span>
                            </div>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="detail-row">
                            <span>Selected Seats:</span>
                            <span className="seats-count">
                                {selectedSeats.length} seat(s)
                            </span>
                        </div>
                        
                        <div className="detail-row total">
                            <span>Total Amount:</span>
                            <strong className="total-amount">₹{totalPrice}</strong>
                        </div>
                    </div>

                    {selectedSeats.length > 0 ? (
                        <>
                            <button className="book-now-btn" onClick={handleBooking}>
                                <FaUserCheck /> Book Selected Seats
                            </button>
                            <button 
                                className="clear-btn"
                                onClick={() => setSelectedSeats([])}
                            >
                                Clear Selection
                            </button>
                        </>
                    ) : (
                        <div className="empty-selection">
                            <FaUserTimes />
                            <p>No seats selected yet</p>
                            <p className="hint">Click on available seats to select</p>
                        </div>
                    )}

                    {!token && (
                        <div className="login-prompt">
                            <FaInfoCircle />
                            <p>You need to be logged in to book seats</p>
                            <button 
                                className="login-btn"
                                onClick={() => navigate('/login')}
                            >
                                Login to Book
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Seats