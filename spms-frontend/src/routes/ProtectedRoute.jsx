import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Requires authentication
export function ProtectedRoute() {
  const { isAuth } = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}

// Requires ADMIN role
export function AdminRoute() {
  const { isAuth, isAdmin } = useAuth()
  if (!isAuth)    return <Navigate to="/login"     replace />
  if (!isAdmin)   return <Navigate to="/dashboard" replace />
  return <Outlet />
}

// Redirects logged-in users away from /login
export function PublicRoute() {
  const { isAuth, isAdmin } = useAuth()
  if (isAuth) return <Navigate to={isAdmin ? '/dashboard' : '/student-portal'} replace />
  return <Outlet />
}
