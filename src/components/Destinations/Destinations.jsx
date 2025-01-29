import { useState, useEffect } from 'react'
import { getAllDestinations } from '../../services/destinationService'
import BookingModal from '../Bookings/BookingModal'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Destinations.css'

function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations()
        console.log('Fetched destinations:', data) // For debugging
        setDestinations(data)
        setError(null)
      } catch (err) {
        console.error('Error in Destinations component:', err)
        setError('Failed to load destinations. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const handleBooking = (destination) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSelectedDestination(destination)
  }

  const handleBookingSuccess = () => {
    setSelectedDestination(null)
    // Show success message or redirect to bookings page
    navigate('/bookings')
  }

  if (loading) {
    return (
      <div className="destinations">
        <div className="loading">Loading destinations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="destinations">
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="destinations">
      <h2>Popular Destinations</h2>
      {destinations.length === 0 ? (
        <div className="no-destinations">
          No destinations available at the moment.
        </div>
      ) : (
        <div className="destination-grid">
          {destinations.map(destination => (
            <div key={destination._id} className="destination-card">
              <div className="destination-image">
                <img 
                  src={destination.image}
                  alt={destination.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
                  }}
                />
              </div>
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <p className="country">{destination.country}</p>
                <p className="description">{destination.description}</p>
                <div className="destination-details">
                  <p className="price">From ${destination.price}</p>
                  <p className="duration">{destination.duration || 'Flexible'}</p>
                </div>
                <button 
                  className="book-button"
                  onClick={() => handleBooking(destination)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDestination && (
        <BookingModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}

export default Destinations 