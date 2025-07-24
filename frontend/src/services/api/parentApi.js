// src/services/api/parentApi.js
import { apiClient } from './client'

// TODO: This should come from your auth/user context
// For now, using a test customer ID
const CUSTOMER_ID = 'TEST-CUSTOMER-001'

export const parentApi = {
  // Parent Management
  search: (params) => {
    const cleanParams = Object.entries(params)
      .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    
    // Add customer_id to all requests
    cleanParams.customer_id = CUSTOMER_ID
    
    return apiClient.get('/parents/search', { params: cleanParams })
  },
  
  get: (id) => apiClient.get(`/parents/${id}`, { 
    params: { customer_id: CUSTOMER_ID } 
  }),
  
  create: (data) => apiClient.post('/parents', data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  update: (id, data) => apiClient.put(`/parents/${id}`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  delete: (id) => apiClient.delete(`/parents/${id}`, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  getStats: () => apiClient.get('/parents/stats', {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Children Management
  getChildren: (parentId) => apiClient.get(`/parents/${parentId}/children`, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  addChild: (parentId, data) => apiClient.post(`/parents/${parentId}/children`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  updateChild: (childId, data) => apiClient.patch(`/children/${childId}`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  deleteChild: (childId) => apiClient.delete(`/children/${childId}`, {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Notes Management
  getNotes: (parentId, params) => apiClient.get(`/parents/${parentId}/notes`, { 
    params: { ...params, customer_id: CUSTOMER_ID }
  }),
  
  addNote: (parentId, data) => apiClient.post(`/parents/${parentId}/notes`, data, {
    params: { customer_id: CUSTOMER_ID, user_id: 'TEST-USER-001' }  // Also needs user_id
  }),
  
  updateNote: (noteId, data) => apiClient.patch(`/notes/${noteId}`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  deleteNote: (noteId) => apiClient.delete(`/notes/${noteId}`, {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Task Management (These endpoints don't exist in backend yet)
  getTasks: (parentId) => apiClient.get(`/parents/${parentId}/tasks`, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  addTask: (parentId, data) => apiClient.post(`/parents/${parentId}/tasks`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  updateTask: (taskId, data) => apiClient.patch(`/tasks/${taskId}`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  deleteTask: (taskId) => apiClient.delete(`/tasks/${taskId}`, {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Email Management (These endpoints don't exist in backend yet)
  getEmails: (parentId, params) => apiClient.get(`/parents/${parentId}/emails`, { 
    params: { ...params, customer_id: CUSTOMER_ID }
  }),
  
  getEmailDetails: (emailId) => apiClient.get(`/emails/${emailId}`, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  sendEmail: (parentId, data) => apiClient.post(`/parents/${parentId}/emails`, data, {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Journey Events (These endpoints don't exist in backend yet)
  getJourneyEvents: (parentId) => apiClient.get(`/parents/${parentId}/journey`, {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Bulk Operations (These endpoints don't exist in backend yet)
  bulkUpdateStatus: (data) => apiClient.post('/parents/bulk/status', data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  bulkAddTag: (data) => apiClient.post('/parents/bulk/tags', data, {
    params: { customer_id: CUSTOMER_ID }
  }),
  
  bulkDelete: (data) => apiClient.post('/parents/bulk/delete', data, {
    params: { customer_id: CUSTOMER_ID }
  }),

  // Import/Export (These endpoints don't exist in backend yet)
  export: (parentIds = null) => {
    const params = { customer_id: CUSTOMER_ID }
    if (parentIds) {
      params.parent_ids = parentIds.join(',')
    }
    return apiClient.get('/parents/export', { 
      params,
      responseType: 'blob'
    })
  },
  
  import: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/parents/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { customer_id: CUSTOMER_ID }
    })
  },

  // Additional Features (These endpoints don't exist in backend yet)
  merge: (primaryId, duplicateIds) => 
    apiClient.post('/parents/merge', 
      { primary_id: primaryId, duplicate_ids: duplicateIds },
      { params: { customer_id: CUSTOMER_ID } }
    ),
  
  generateReport: (params) => 
    apiClient.get('/parents/report', { 
      params: { ...params, customer_id: CUSTOMER_ID }, 
      responseType: 'blob' 
    })
}

// Debug - log available methods
console.log('parentApi methods:', Object.keys(parentApi))