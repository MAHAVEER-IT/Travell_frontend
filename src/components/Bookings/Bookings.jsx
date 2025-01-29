import { useState, useEffect } from 'react'
import { getUserBookings, cancelBooking } from '../../services/bookingService'
import { useNavigate } from 'react-router-dom'
import './Bookings.css'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const navigate = useNavigate()

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings()
      console.log('Fetched bookings:', data)
      setBookings(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancellingId(bookingId)
      await cancelBooking(bookingId)
      
      // Show success message (optional)
      const successMessage = document.createElement('div')
      successMessage.className = 'success-message'
      successMessage.textContent = 'Booking cancelled successfully'
      document.body.appendChild(successMessage)
      setTimeout(() => successMessage.remove(), 3000)
      
      // Refresh the bookings list
      await fetchBookings()
    } catch (err) {
      console.error('Error cancelling booking:', err)
      setError(err.message || 'Failed to cancel booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const handleViewDetails = (bookingId) => {
    // Navigate to booking details page (if you have one)
    navigate(`/bookings/${bookingId}`)
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status confirmed'
      case 'pending':
        return 'status pending'
      case 'cancelled':
        return 'status cancelled'
      default:
        return 'status'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bookings">
        <div className="loading">Loading your bookings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bookings">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="dismiss-button">
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bookings">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <button onClick={() => navigate('/destinations')} className="browse-button">
            Browse Destinations
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-image">
                <img 
                  src={booking.destination.image} 
                  alt={booking.destination.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                  }}
                />
              </div>
              <div className="booking-details">
                <h3>{booking.destination.name}</h3>
                <div className="booking-info">
                  <p><strong>Check-in:</strong> {formatDate(booking.startDate)}</p>
                  <p><strong>Check-out:</strong> {formatDate(booking.endDate)}</p>
                  <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status}
                    </span>
                  </p>
                </div>
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <button 
                      className="cancel-button"
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookings 