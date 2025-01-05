import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import LoadingSpinner from './LoadingSpinner'

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  if (!user) {
    // Redirect to login but save the attempted url
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (requireAdmin) {
    // Check if user has admin role
    const isAdmin = user.role === 'admin'
    if (!isAdmin) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
