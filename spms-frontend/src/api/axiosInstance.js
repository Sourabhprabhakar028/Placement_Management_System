import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: attach access token ──
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spms_access')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: auto-refresh on 401 ──
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  )
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return axiosInstance(original)
        })
      }

      original._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('spms_refresh')
      if (!refreshToken) {
        isRefreshing = false
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post('http://localhost:8081/auth/refresh', { refreshToken })
        const newToken = data.accessToken
        localStorage.setItem('spms_access',  newToken)
        localStorage.setItem('spms_refresh', data.refreshToken)
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`
        original.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return axiosInstance(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
