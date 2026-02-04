import React, { useState } from 'react';
import axios from 'axios';
import  '../../assets/styles/AddBus.css'

const AddBus = () => {
  const [formData, setFormData] = useState({
    bus_name: '',
    bus_number: '',
    orgin: '',
    destination: '',
    features: '',
    start_time: '',
    reach_time: '',
    no_of_seats: '',
    price: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8000/api/buses/', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setSuccess('🎉 Bus added successfully!');
      // Reset form
      setFormData({
        bus_name: '',
        bus_number: '',
        orgin: '',
        destination: '',
        features: '',
        start_time: '',
        reach_time: '',
        no_of_seats: '',
        price: ''
      });
    } catch (err) {
      if (err.response) {
        setError('❌ ' + (err.response.data.detail || 'Error adding bus. Please check the data.'));
      } else if (err.request) {
        setError('❌ No response from server. Please check if the server is running.');
      } else {
        setError('❌ Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbus-container">
      <h1 className="addbus-title">Add New Bus</h1>
      
      {error && (
        <div className="alert-message alert-error">
          <span className="alert-icon">!</span>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert-message alert-success">
          <span className="alert-icon">✓</span>
          {success}
        </div>
      )}

      <div className="addbus-form-container">
        <form onSubmit={handleSubmit} className="addbus-form">
          <div className="form-grid">
            {/* Bus Name */}
            <div className="form-group">
              <label htmlFor="bus_name">
                Bus Name <span>*</span>
              </label>
              <input
                type="text"
                id="bus_name"
                name="bus_name"
                value={formData.bus_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter bus name (e.g., Luxury Express)"
              />
              <div className="form-help">Enter a descriptive name for the bus</div>
            </div>

            {/* Bus Number */}
            <div className="form-group">
              <label htmlFor="bus_number">
                Bus Number <span>*</span>
              </label>
              <input
                type="text"
                id="bus_number"
                name="bus_number"
                value={formData.bus_number}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter unique bus number"
              />
              <div className="form-help">This must be a unique identifier</div>
            </div>

            {/* Origin */}
            <div className="form-group">
              <label htmlFor="orgin">
                Origin <span>*</span>
              </label>
              <input
                type="text"
                id="orgin"
                name="orgin"
                value={formData.orgin}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter starting city"
              />
            </div>

            {/* Destination */}
            <div className="form-group">
              <label htmlFor="destination">
                Destination <span>*</span>
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter destination city"
              />
            </div>

            {/* Start Time */}
            <div className="form-group">
              <label htmlFor="start_time">
                Departure Time <span>*</span>
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Reach Time */}
            <div className="form-group">
              <label htmlFor="reach_time">
                Arrival Time <span>*</span>
              </label>
              <input
                type="time"
                id="reach_time"
                name="reach_time"
                value={formData.reach_time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Number of Seats */}
            <div className="form-group">
              <label htmlFor="no_of_seats">
                Total Seats <span>*</span>
              </label>
              <input
                type="number"
                id="no_of_seats"
                name="no_of_seats"
                value={formData.no_of_seats}
                onChange={handleChange}
                required
                min="1"
                max="100"
                className="form-input"
                placeholder="Enter total seats"
              />
              <div className="form-help">Maximum 100 seats</div>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">
                Price per Seat (₹) <span>*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-input"
                placeholder="Enter ticket price"
              />
              <div className="form-help">Enter price in Indian Rupees</div>
            </div>
          </div>

          {/* Features */}
          <div className="form-group">
            <label htmlFor="features">Amenities & Features</label>
            <textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows="4"
              className="form-textarea"
              placeholder="List bus amenities (e.g., AC, WiFi, Reclining seats, Charging ports, Snacks, TV)"
            />
            <div className="form-help">Separate features with commas</div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Adding Bus...' : 'Add New Bus'}
            </button>
            <div className="required-indicator">
              * indicates required field
            </div>
          </div>
        </form>
      </div>

      {/* Instructions Panel */}
      <div className="instructions-panel">
        <h3 className="instructions-title">Important Instructions</h3>
        <ul className="instructions-list">
          <li className="instruction-item">All fields marked with * are mandatory</li>
          <li className="instruction-item">Bus number must be unique across the system</li>
          <li className="instruction-item">Use 24-hour format for time (e.g., 14:30 for 2:30 PM)</li>
          <li className="instruction-item">Price accepts decimal values (up to 2 decimal places)</li>
          <li className="instruction-item">Features field supports multiple amenities</li>
          <li className="instruction-item">Ensure arrival time is after departure time</li>
          <li className="instruction-item">Double-check all information before submission</li>
        </ul>
      </div>
    </div>
  );
};

export default AddBus;