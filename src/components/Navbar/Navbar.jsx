import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>NextStop</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/destinations">Destinations</Link></li>
        <li><Link to="/bookings">Bookings</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
      <div className="auth-links">
        {user ? (
          <button onClick={logout} className="signout-link">
            Sign Out
          </button>
        ) : (
          <>
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar 