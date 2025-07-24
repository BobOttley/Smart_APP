// src/services/api/client.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // Extract error message
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   error.message || 
                   'An error occurred'
    
    // Create a more friendly error
    const friendlyError = new Error(message)
    friendlyError.response = error.response
    friendlyError.status = error.response?.status
    
    return Promise.reject(friendlyError)
  }
)