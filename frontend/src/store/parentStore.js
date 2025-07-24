import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import axios from 'axios'

// Create API client
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Parent API functions
const parentApi = {
  search: async (params) => {
    const response = await apiClient.get('/parents/search', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/parents/${id}`)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await apiClient.patch(`/parents/${id}`, data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/parents/${id}`)
    return response.data
  },
  
  getStats: async () => {
    const response = await apiClient.get('/parents/stats')
    return response.data
  },
  
  // Children endpoints
  getChildren: async (parentId) => {
    const response = await apiClient.get(`/parents/${parentId}/children`)
    return response.data
  },
  
  addChild: async (parentId, childData) => {
    const response = await apiClient.post(`/parents/${parentId}/children`, childData)
    return response.data
  },
  
  updateChild: async (childId, data) => {
    const response = await apiClient.patch(`/children/${childId}`, data)
    return response.data
  },
  
  deleteChild: async (childId) => {
    const response = await apiClient.delete(`/children/${childId}`)
    return response.data
  },
  
  // Tasks endpoints
  getTasks: async (parentId) => {
    const response = await apiClient.get(`/parents/${parentId}/tasks`)
    return response.data
  },
  
  addTask: async (parentId, taskData) => {
    const response = await apiClient.post(`/parents/${parentId}/tasks`, taskData)
    return response.data
  },
  
  updateTask: async (taskId, data) => {
    const response = await apiClient.patch(`/tasks/${taskId}`, data)
    return response.data
  },
  
  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/tasks/${taskId}`)
    return response.data
  },
  
  // Notes endpoints
  getNotes: async (parentId) => {
    const response = await apiClient.get(`/parents/${parentId}/notes`)
    return response.data
  },
  
  addNote: async (parentId, noteData) => {
    const response = await apiClient.post(`/parents/${parentId}/notes`, noteData)
    return response.data
  },
  
  // Email endpoints (commented out to avoid errors)
  getEmails: async (parentId) => {
    // const response = await apiClient.get(`/parents/${parentId}/emails`)
    // return response.data
    return { data: [] } // Return empty for now
  },
  
  // Journey endpoints (commented out to avoid errors)
  getJourneyEvents: async (parentId) => {
    // const response = await apiClient.get(`/parents/${parentId}/journey`)
    // return response.data
    return { data: [] } // Return empty for now
  },
  
  // Bulk operations
  bulkUpdateStatus: async (parentIds, status) => {
    const response = await apiClient.post('/parents/bulk/status', { parent_ids: parentIds, status })
    return response.data
  },
  
  bulkUpdateTags: async (parentIds, tags) => {
    const response = await apiClient.post('/parents/bulk/tags', { parent_ids: parentIds, tags })
    return response.data
  },
  
  bulkDelete: async (parentIds) => {
    const response = await apiClient.post('/parents/bulk/delete', { parent_ids: parentIds })
    return response.data
  }
}

// Create the store
const useParentStore = create((set, get) => ({
  // State
  parents: [],
  selectedParent: null,
  stats: null,
  loading: false,
  error: null,
  selectedParentIds: [],
  
  // Filters
  filters: {
    search: '',
    status: '',
    stage: '',
    source: '',
    score_min: null,
    score_max: null,
    created_after: null,
    created_before: null,
    last_contact_after: null,
    has_children: null,
    per_page: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  },
  
  // Pagination
  pagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  
  // Actions
  setFilter: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, current: 1 }
    }))
  },
  
  setMultipleFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, current: 1 }
    }))
  },
  
  clearFilters: () => {
    set({
      filters: {
        search: '',
        status: '',
        stage: '',
        source: '',
        score_min: null,
        score_max: null,
        created_after: null,
        created_before: null,
        last_contact_after: null,
        has_children: null,
        per_page: 20,
        sort_by: 'created_at',
        sort_order: 'desc'
      },
      pagination: { current: 1, pages: 1, total: 0 }
    })
  },
  
  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, current: page }
    }))
  },
  
  toggleParentSelection: (parentId) => {
    set(state => ({
      selectedParentIds: state.selectedParentIds.includes(parentId)
        ? state.selectedParentIds.filter(id => id !== parentId)
        : [...state.selectedParentIds, parentId]
    }))
  },
  
  selectAllParents: () => {
    set(state => ({
      selectedParentIds: state.parents.map(p => p.id)
    }))
  },
  
  clearSelection: () => {
    set({ selectedParentIds: [] })
  },
  
  // Fetch parents with search and filters
  fetchParents: async () => {
    set({ loading: true, error: null })
    try {
      const { filters, pagination } = get()
      const params = {
        ...filters,
        page: pagination.current,
        per_page: filters.per_page
      }
      
      console.log('Fetching parents with params:', params)
      
      const response = await parentApi.search(params)
      
      // Safely handle the response
      const parents = response.parents || []
      const paginationData = {
        current: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0
      }
      
      set({ 
        parents: parents,
        pagination: paginationData,
        loading: false 
      })
    } catch (error) {
      console.error('Failed to fetch parents:', error)
      set({ 
        error: error.message, 
        loading: false,
        parents: []
      })
      toast.error('Failed to fetch parents')
    }
  },
  
  // Fetch single parent
  fetchParent: async (id) => {
    set({ loading: true, error: null })
    try {
      const parent = await parentApi.getById(id)
      set({ selectedParent: parent, loading: false })
      return parent
    } catch (error) {
      console.error('Failed to fetch parent:', error)
      set({ error: error.message, loading: false })
      toast.error('Failed to fetch parent details')
      throw error
    }
  },
  
  // Update parent
  updateParent: async (id, data) => {
    try {
      const updatedParent = await parentApi.update(id, data)
      
      // Update in the list
      set(state => ({
        parents: state.parents.map(p => 
          p.id === id ? { ...p, ...updatedParent } : p
        ),
        selectedParent: state.selectedParent?.id === id 
          ? { ...state.selectedParent, ...updatedParent }
          : state.selectedParent
      }))
      
      toast.success('Parent updated successfully')
      return updatedParent
    } catch (error) {
      console.error('Failed to update parent:', error)
      toast.error('Failed to update parent')
      throw error
    }
  },
  
  // Delete parent
  deleteParent: async (id) => {
    try {
      await parentApi.delete(id)
      
      set(state => ({
        parents: state.parents.filter(p => p.id !== id),
        selectedParent: state.selectedParent?.id === id ? null : state.selectedParent,
        selectedParentIds: state.selectedParentIds.filter(pid => pid !== id)
      }))
      
      toast.success('Parent deleted successfully')
    } catch (error) {
      console.error('Failed to delete parent:', error)
      toast.error('Failed to delete parent')
      throw error
    }
  },
  
  // Fetch stats
  fetchStats: async () => {
    try {
      const stats = await parentApi.getStats()
      set({ stats })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Don't show error toast for stats
    }
  },
  
  // Bulk operations
  bulkUpdateStatus: async (status) => {
    const { selectedParentIds } = get()
    if (!selectedParentIds.length) {
      toast.error('No parents selected')
      return
    }
    
    try {
      await parentApi.bulkUpdateStatus(selectedParentIds, status)
      toast.success(`Updated status for ${selectedParentIds.length} parents`)
      set({ selectedParentIds: [] })
      get().fetchParents()
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    }
  },
  
  bulkUpdateTags: async (tags) => {
    const { selectedParentIds } = get()
    if (!selectedParentIds.length) {
      toast.error('No parents selected')
      return
    }
    
    try {
      await parentApi.bulkUpdateTags(selectedParentIds, tags)
      toast.success(`Updated tags for ${selectedParentIds.length} parents`)
      set({ selectedParentIds: [] })
      get().fetchParents()
    } catch (error) {
      console.error('Failed to update tags:', error)
      toast.error('Failed to update tags')
    }
  },
  
  bulkDelete: async () => {
    const { selectedParentIds } = get()
    if (!selectedParentIds.length) {
      toast.error('No parents selected')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedParentIds.length} parents?`)) {
      return
    }
    
    try {
      await parentApi.bulkDelete(selectedParentIds)
      toast.success(`Deleted ${selectedParentIds.length} parents`)
      set({ selectedParentIds: [] })
      get().fetchParents()
    } catch (error) {
      console.error('Failed to delete parents:', error)
      toast.error('Failed to delete parents')
    }
  }
}))

// Export both the store and the API
export { useParentStore, parentApi }
export default useParentStore