import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import Home from '../components/Home/Home'
import Profile from '../components/Profile/Profile'
import Destinations from '../components/Destinations/Destinations'
import Bookings from '../components/Bookings/Bookings'
import Navbar from '../components/Navbar/Navbar'

function AppRoutes() {
  const { user, isAuthenticated } = useAuth()

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }
    return children
  }

  // Layout with Navbar for authenticated users
  const AuthenticatedLayout = ({ children }) => {
    return (
      <div className="app">
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Home />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Profile />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/destinations" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Destinations />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/bookings" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Bookings />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes 