import { useState } from 'react'
import { createBooking } from '../../services/bookingService'
import './BookingModal.css'

function BookingModal({ destination, onClose, onSuccess }) {
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate) return destination.price

    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return destination.price * days
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const booking = {
        destination: destination._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice: calculateTotalPrice()
      }

      await createBooking(booking)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Book Your Trip to {destination.name}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={bookingData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={bookingData.endDate}
              onChange={handleChange}
              min={bookingData.startDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="booking-summary">
            <div className="summary-item">
              <span>Base Price:</span>
              <span>${destination.price}/day</span>
            </div>
            {bookingData.startDate && bookingData.endDate && (
              <div className="summary-item">
                <span>Duration:</span>
                <span>
                  {Math.ceil(
                    (new Date(bookingData.endDate) - new Date(bookingData.startDate)) / 
                    (1000 * 60 * 60 * 24)
                  )} days
                </span>
              </div>
            )}
            <div className="summary-item total">
              <span>Total Price:</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookingModal 