import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './Profile.css'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Get first letter of name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?'
  }

  if (!user) {
    return (
      <div className="profile">
        <p>Please log in to view your profile.</p>
      </div>
    )
  }

  const handleError = () =>{
    logout()
    navigate('/login')
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{getInitial(user.name)}</span>
        </div>
        <div className="profile-info">
          <h2>{user.name || 'User'}</h2>
          <p>{user.email || 'No email provided'}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Account Type</h3>
          <p>{user.role || 'User'}</p>
        </div>
        <div className="stat-card">
          <h3>Member Since</h3>
          <p>{user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile 