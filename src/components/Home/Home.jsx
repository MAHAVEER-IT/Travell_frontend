import { useState, useEffect } from 'react'
import { getRecentDestinations } from '../../services/destinationService'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const [recentDestinations, setRecentDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecentDestinations = async () => {
      try {
        const data = await getRecentDestinations(3) // Fetch 3 recent destinations
        setRecentDestinations(data)
      } catch (err) {
        console.error('Error fetching recent destinations:', err)
        setError('Failed to load recent destinations')
      } finally {
        setLoading(false)
      }
    }

    fetchRecentDestinations()
  }, [])

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to NextStop</h1>
        <p>Your perfect travel companion</p>
      </header>
      
      <section className="features">
        <div className="feature-card">
          <h3>Find Destinations</h3>
          <p>Discover amazing places around the world</p>
        </div>
        <div className="feature-card">
          <h3>Easy Booking</h3>
          <p>Book your trips with just a few clicks</p>
        </div>
        <div className="feature-card">
          <h3>Travel Planning</h3>
          <p>Plan your itinerary effortlessly</p>
        </div>
      </section>

      <section className="recent-destinations">
        <h2>Recently Added Destinations</h2>
        {loading ? (
          <div className="loading">Loading destinations...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="destinations-grid">
            {recentDestinations.map(destination => (
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
                <div className="destination-content">
                  <h3>{destination.name}</h3>
                  <p className="country">{destination.country}</p>
                  <p className="description">{destination.description}</p>
                  <div className="price-info">
                    <span className="price">From ${destination.price}</span>
                    <Link 
                      to={`/destinations`} 
                      className="view-more"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="view-all">
          <Link to="/destinations" className="view-all-button">
            View All Destinations
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home