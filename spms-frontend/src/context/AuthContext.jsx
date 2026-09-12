import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('spms_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('spms_access') || null
  )
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('spms_refresh') || null
  )
  const [loading, setLoading] = useState(false)

  // ── Persist to localStorage whenever state changes ──
  useEffect(() => {
    if (accessToken)  localStorage.setItem('spms_access',  accessToken)
    else              localStorage.removeItem('spms_access')
    if (refreshToken) localStorage.setItem('spms_refresh', refreshToken)
    else              localStorage.removeItem('spms_refresh')
    if (user)         localStorage.setItem('spms_user',    JSON.stringify(user))
    else              localStorage.removeItem('spms_user')
  }, [accessToken, refreshToken, user])

  // ── Login ──
  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password })
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser({ email, role: data.role })
      toast.success('Welcome back!')
      if (data.role === 'ADMIN')   navigate('/dashboard')
      else                          navigate('/student-portal')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // ── Register ──
  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.post('/auth/register', payload)
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setUser({ email: payload.email, role: data.role })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // ── Refresh access token ──
  const refresh = useCallback(async () => {
    if (!refreshToken) return null
    try {
      const { data } = await axiosInstance.post('/auth/refresh', { refreshToken })
      setAccessToken(data.accessToken)
      return data.accessToken
    } catch {
      logout()
      return null
    }
  }, [refreshToken])

  // ── Logout ──
  const logout = useCallback(async () => {
    try {
      if (accessToken) await axiosInstance.post('/auth/logout')
    } catch { /* ignore */ }
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    navigate('/login')
    toast.info('Signed out')
  }, [accessToken, navigate])

  // ── Change password ──
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    await axiosInstance.post('/auth/change-password', { currentPassword, newPassword })
    toast.success('Password updated!')
  }, [])

  const isAdmin   = user?.role === 'ADMIN'
  const isStudent = user?.role === 'STUDENT'
  const isAuth    = !!accessToken

  return (
    <AuthContext.Provider value={{
      user, accessToken, refreshToken,
      loading, isAdmin, isStudent, isAuth,
      login, register, logout, refresh, changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
