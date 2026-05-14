import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carbon_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser    = (data) => api.post('/auth/login',    data)
export const registerUser = (data) => api.post('/auth/register', data)

// ── Claims ────────────────────────────────────────────────────────────────────
export const validateClaim = (data) => api.post('/claims/validate', data)
export const getHistory    = (page = 1, limit = 10) => api.get(`/claims/history?page=${page}&limit=${limit}`)
export const getStats      = ()     => api.get('/claims/stats')
export const deleteClaim   = (id)   => api.delete(`/claims/${id}`)

export default api
