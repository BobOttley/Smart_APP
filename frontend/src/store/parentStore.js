// Replace the fetchParents function in your parentStore.js with this debug version:

fetchParents: async () => {
  set({ loading: true, error: null })
  try {
    const { filters, pagination } = get()
    const params = {
      ...filters,
      page: pagination.current,
      per_page: filters.per_page
    }
    
    console.log('=== FETCH PARENTS DEBUG ===')
    console.log('Params before API call:', params)
    console.log('parentApi.search function:', parentApi.search)
    
    const response = await parentApi.search(params)
    
    console.log('API Response:', response)
    
    // Safely handle the response
    const parents = response.data?.parents || []
    const paginationData = {
      current: response.data?.page || 1,
      pages: response.data?.pages || 1,
      total: response.data?.total || 0
    }
    
    console.log('Extracted parents:', parents)
    console.log('Pagination data:', paginationData)
    
    set({ 
      parents: parents,
      pagination: paginationData,
      loading: false 
    })
  } catch (error) {
    console.error('=== FETCH PARENTS ERROR ===')
    console.error('Full error object:', error)
    console.error('Error response:', error.response)
    console.error('Error response data:', error.response?.data)
    console.error('Error response status:', error.response?.status)
    
    set({ 
      error: error.message, 
      loading: false,
      parents: []  // Ensure parents is always an array
    })
    toast.error('Failed to fetch parents - check console for details')
  }
},