// src/services/api/index.js

// Export all API services from a central location
// This makes imports cleaner throughout the application

// Parent API - for managing parents/enquiries
export { parentApi } from './parentApi'

// Auth API - for authentication and user management
// export { authApi } from './authApi'

// Student API - for managing students
// export { studentApi } from './studentApi'

// Staff API - for managing staff members
// export { staffApi } from './staffApi'

// Communications API - for emails, SMS, etc.
// export { communicationsApi } from './communicationsApi'

// Reports API - for generating various reports
// export { reportsApi } from './reportsApi'

// Dashboard API - for dashboard statistics
// export { dashboardApi } from './dashboardApi'

// Settings API - for system settings
// export { settingsApi } from './settingsApi'

// Export the API client for direct use if needed
export { apiClient } from './client'

// Export any common API utilities
export const apiHelpers = {
  // Helper to build query strings from objects
  buildQueryString: (params) => {
    const filteredParams = Object.entries(params)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    
    return new URLSearchParams(filteredParams).toString()
  },

  // Helper to handle file downloads
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  // Helper to format errors
  formatError: (error) => {
    if (error.response?.data?.detail) {
      return error.response.data.detail
    }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  }
}