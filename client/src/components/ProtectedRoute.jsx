import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps protected pages: unauthenticated visitors are redirected to /login,
// carrying the current location so Login can send them back afterwards.
export default function ProtectedRoute({ children }) {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
