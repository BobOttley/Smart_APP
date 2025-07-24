// src/services/api.js
import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add customer_id to params if not present
    const customerId = localStorage.getItem('customer_id') || 'SCHOOL-001'
    if (config.params) {
      config.params.customer_id = config.params.customer_id || customerId
    } else {
      config.params = { customer_id: customerId }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    return Promise.reject(error)
  }
)

// Parent endpoints
export const parentApi = {
  // Get parent statistics
  getStats: () => api.get('/parents/stats'),
  
  // Search parents
  search: (params) => api.get('/parents/search', { params }),
  
  // Get single parent
  get: (id) => api.get(`/parents/${id}`),
  
  // Create parent
  create: (data) => api.post('/parents', data),
  
  // Update parent
  update: (id, data) => api.put(`/parents/${id}`, data),
  
  // Delete parent
  delete: (id) => api.delete(`/parents/${id}`),
  
  // Add child to parent
  addChild: (parentId, data) => api.post(`/parents/${parentId}/children`, data),
  
  // Add note to parent
  addNote: (parentId, data) => api.post(`/parents/${parentId}/notes`, data, {
    params: { user_id: localStorage.getItem('user_id') || 'USER-001' }
  }),
}

export default api