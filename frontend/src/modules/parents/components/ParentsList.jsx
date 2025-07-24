// src/modules/parents/components/ParentsList.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, Plus, ChevronLeft, ChevronRight, 
  Download, Upload, Mail, Trash2, Tag, CheckSquare,
  Square, Calendar, X, MoreVertical
} from 'lucide-react'
import useParentStore from '@store/parentStore'
import ParentCard from './ParentCard'
import StatsCard from './StatsCard'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// Advanced Filter Component
const AdvancedFilters = ({ filters, onApply, onClose }) => {
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    stage: filters.stage || '',
    source: filters.source || '',
    min_lead_score: filters.min_lead_score || '',  // Changed from leadScoreMin
    max_lead_score: filters.max_lead_score || '',  // Changed from leadScoreMax
    created_after: filters.created_after || '',    // Changed from dateFrom
    created_before: filters.created_before || '',  // Changed from dateTo
    has_children: filters.has_children || '',      // Changed from hasChildren
    tags: filters.tags || []
  })

  const handleApply = () => {
    const cleanFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && (Array.isArray(value) ? value.length > 0 : true)) {
        // Convert has_children to boolean
        if (key === 'has_children' && value !== '') {
          acc[key] = value === 'yes'
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {})
    onApply(cleanFilters)
  }

  const handleReset = () => {
    setLocalFilters({
      status: '',
      stage: '',
      source: '',
      leadScoreMin: '',
      leadScoreMax: '',
      engagementMin: '',
      engagementMax: '',
      dateFrom: '',
      dateTo: '',
      hasChildren: '',
      tags: []
    })
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Status & Stage */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">All Status</option>
              <option value="lead">Lead</option>
              <option value="warm">Warm</option>
              <option value="applicant">Applicant</option>
              <option value="offer_made">Offer Made</option>
              <option value="enrolled">Enrolled</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              value={localFilters.stage}
              onChange={(e) => setLocalFilters({ ...localFilters, stage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">All Stages</option>
              <option value="initial_enquiry">Initial Enquiry</option>
              <option value="school_visit">School Visit</option>
              <option value="application">Application</option>
              <option value="assessment">Assessment</option>
              <option value="decision">Decision</option>
              <option value="enrolled">Enrolled</option>
            </select>
          </div>
        </div>

        {/* Lead Score Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lead Score Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.leadScoreMin}
              onChange={(e) => setLocalFilters({ ...localFilters, leadScoreMin: e.target.value })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
              min="0"
              max="100"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.leadScoreMax}
              onChange={(e) => setLocalFilters({ ...localFilters, leadScoreMax: e.target.value })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Engagement Score Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Score Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.engagementMin}
              onChange={(e) => setLocalFilters({ ...localFilters, engagementMin: e.target.value })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
              min="0"
              max="100"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.engagementMax}
              onChange={(e) => setLocalFilters({ ...localFilters, engagementMax: e.target.value })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={localFilters.dateFrom}
              onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
            />
            <input
              type="date"
              value={localFilters.dateTo}
              onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            value={localFilters.source}
            onChange={(e) => setLocalFilters({ ...localFilters, source: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          >
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="event">Event</option>
            <option value="direct">Direct</option>
          </select>
        </div>

        {/* Has Children */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Has Children
          </label>
          <select
            value={localFilters.hasChildren}
            onChange={(e) => setLocalFilters({ ...localFilters, hasChildren: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          >
            <option value="">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-between">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Reset
        </button>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-hover"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// Bulk Actions Component
const BulkActions = ({ selectedCount, onAction, onClose }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <span className="text-sm font-medium text-blue-900">
        {selectedCount} parent{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onAction('email')}
          className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300"
        >
          <Mail className="h-4 w-4 mr-1" />
          Send Email
        </button>
        <button
          onClick={() => onAction('tag')}
          className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300"
        >
          <Tag className="h-4 w-4 mr-1" />
          Add Tag
        </button>
        <button
          onClick={() => onAction('status')}
          className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300"
        >
          Update Status
        </button>
        <button
          onClick={() => onAction('export')}
          className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </button>
        <button
          onClick={() => onAction('delete')}
          className="inline-flex items-center px-3 py-1.5 bg-white text-red-600 text-sm font-medium rounded-md hover:bg-red-50 border border-red-300"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      </div>
      <button
        onClick={onClose}
        className="ml-auto p-1 hover:bg-blue-100 rounded"
      >
        <X className="h-4 w-4 text-blue-900" />
      </button>
    </div>
  )
}

// Main Component
export default function ParentsList() {
  const navigate = useNavigate()
  const {
    parents,
    stats,
    filters,
    pagination,
    loading,
    fetchParents,
    fetchStats,
    setFilters,
    setPage,
    bulkUpdateStatus,
    bulkAddTag,
    bulkDelete,
    exportParents
  } = useParentStore()

  const [selectedParents, setSelectedParents] = useState([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchStats()
    fetchParents()
  }, [filters, sortBy, sortOrder])

  useEffect(() => {
    setShowBulkActions(selectedParents.length > 0)
  }, [selectedParents])

  const handleSearch = (e) => {
    setFilters({ query: e.target.value })
  }

  const handleAdvancedFilters = (newFilters) => {
    setFilters(newFilters)
    setShowAdvancedFilters(false)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleSelectAll = () => {
    if (selectedParents.length === parents.length) {
      setSelectedParents([])
    } else {
      setSelectedParents(parents.map(p => p.id))
    }
  }

  const handleSelectParent = (parentId) => {
    if (selectedParents.includes(parentId)) {
      setSelectedParents(selectedParents.filter(id => id !== parentId))
    } else {
      setSelectedParents([...selectedParents, parentId])
    }
  }

  const handleBulkAction = async (action) => {
    switch (action) {
      case 'email':
        navigate('/communications/compose', { state: { parentIds: selectedParents } })
        break
      
      case 'tag':
        const tag = prompt('Enter tag to add:')
        if (tag) {
          try {
            await bulkAddTag(selectedParents, tag)
            toast.success(`Tag added to ${selectedParents.length} parents`)
            setSelectedParents([])
            fetchParents()
          } catch (error) {
            toast.error('Failed to add tags')
          }
        }
        break
      
      case 'status':
        const status = prompt('Enter new status (lead/warm/applicant/offer_made/enrolled/lost):')
        if (status) {
          try {
            await bulkUpdateStatus(selectedParents, status)
            toast.success(`Status updated for ${selectedParents.length} parents`)
            setSelectedParents([])
            fetchParents()
          } catch (error) {
            toast.error('Failed to update status')
          }
        }
        break
      
      case 'export':
        try {
          await exportParents(selectedParents)
          toast.success('Export started')
        } catch (error) {
          toast.error('Failed to export')
        }
        break
      
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedParents.length} parents?`)) {
          try {
            await bulkDelete(selectedParents)
            toast.success(`${selectedParents.length} parents deleted`)
            setSelectedParents([])
            fetchParents()
          } catch (error) {
            toast.error('Failed to delete parents')
          }
        }
        break
    }
  }

  const handlePageChange = (page) => {
    setPage(page)
    setSelectedParents([])
  }

  const applyQuickFilter = (preset) => {
    switch (preset) {
      case 'hot_leads':
        // Backend expects single status and min_lead_score (not leadScoreMin)
        setFilters({ min_lead_score: 80, status: 'lead' })
        break
      case 'at_risk':
        // Backend expects max_lead_score (not engagementMax) and single status
        setFilters({ max_lead_score: 30, status: 'applicant' })
        break
      case 'recent':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        // Backend expects created_after (not dateFrom)
        setFilters({ created_after: weekAgo.toISOString().split('T')[0] })
        break
      case 'no_children':
        setFilters({ has_children: false })  // Backend expects boolean, not 'no'
        break
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-gray-900">Parents & Enquiries</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/parents/import')}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 border border-gray-300"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </button>
              <button
                onClick={() => navigate('/parents/new')}
                className="inline-flex items-center px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue-hover transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Parent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Parents"
              value={stats.total_parents}
              trend="+12%"
              trendUp={true}
            />
            <StatsCard
              title="New This Week"
              value={stats.recent_enquiries_7d}
              trend="+5"
              trendUp={true}
            />
            <StatsCard
              title="Conversion Rate"
              value={`${stats.conversion_rate}%`}
              trend="+2.1%"
              trendUp={true}
            />
            <StatsCard
              title="At Risk"
              value={stats.high_risk_count}
              trend="-3"
              trendUp={false}
            />
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search parents..."
              value={filters.query || ''}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={clsx(
                'inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium',
                showAdvancedFilters
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </button>
            
            {showAdvancedFilters && (
              <AdvancedFilters
                filters={filters}
                onApply={handleAdvancedFilters}
                onClose={() => setShowAdvancedFilters(false)}
              />
            )}
          </div>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="lead_score-desc">Highest Lead Score</option>
            <option value="lead_score-asc">Lowest Lead Score</option>
            <option value="engagement_score-desc">Most Engaged</option>
            <option value="engagement_score-asc">Least Engaged</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3">
          <span className="text-sm text-gray-600">Quick filters:</span>
          <button
            onClick={() => applyQuickFilter('hot_leads')}
            className="text-sm text-brand-blue hover:text-brand-blue-hover"
          >
            Hot Leads
          </button>
          <span className="text-gray-400">•</span>
          <button
            onClick={() => applyQuickFilter('at_risk')}
            className="text-sm text-brand-blue hover:text-brand-blue-hover"
          >
            At Risk
          </button>
          <span className="text-gray-400">•</span>
          <button
            onClick={() => applyQuickFilter('recent')}
            className="text-sm text-brand-blue hover:text-brand-blue-hover"
          >
            Recent Enquiries
          </button>
          <span className="text-gray-400">•</span>
          <button
            onClick={() => applyQuickFilter('no_children')}
            className="text-sm text-brand-blue hover:text-brand-blue-hover"
          >
            No Children Info
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <BulkActions
            selectedCount={selectedParents.length}
            onAction={handleBulkAction}
            onClose={() => setSelectedParents([])}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : parents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No parents found</p>
            {Object.keys(filters).length > 1 && (
              <button
                onClick={() => setFilters({ query: filters.query || '' })}
                className="text-sm text-brand-blue hover:text-brand-blue-hover"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Select All */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {selectedParents.length === parents.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                Select all
              </button>
              <span className="text-sm text-gray-600">
                {parents.length} result{parents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Parent Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parents.map((parent) => (
                <div key={parent.id} className="relative">
                  {/* Selection checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectParent(parent.id)
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:shadow-md"
                    >
                      {selectedParents.includes(parent.id) ? (
                        <CheckSquare className="h-4 w-4 text-brand-blue" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <ParentCard
                    parent={parent}
                    onClick={() => navigate(`/parents/${parent.id}`)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {(pagination.current - 1) * (filters.per_page || 20) + 1} to{' '}
              {Math.min(pagination.current * (filters.per_page || 20), pagination.total)} of{' '}
              {pagination.total} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium',
                  pagination.current === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Page numbers */}
              {(() => {
                const pages = []
                const maxVisible = 5
                let start = Math.max(1, pagination.current - Math.floor(maxVisible / 2))
                let end = Math.min(pagination.pages, start + maxVisible - 1)
                
                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1)
                }
                
                if (start > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    >
                      1
                    </button>
                  )
                  if (start > 2) {
                    pages.push(<span key="dots1" className="px-2 text-gray-500">...</span>)
                  }
                }
                
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={clsx(
                        'px-3 py-1 rounded-md text-sm font-medium',
                        pagination.current === i
                          ? 'bg-brand-blue text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      )}
                    >
                      {i}
                    </button>
                  )
                }
                
                if (end < pagination.pages) {
                  if (end < pagination.pages - 1) {
                    pages.push(<span key="dots2" className="px-2 text-gray-500">...</span>)
                  }
                  pages.push(
                    <button
                      key={pagination.pages}
                      onClick={() => handlePageChange(pagination.pages)}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    >
                      {pagination.pages}
                    </button>
                  )
                }
                
                return pages
              })()}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium',
                  pagination.current === pagination.pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}