// Enhanced ParentDetail.jsx with full functionality
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Mail, Phone, Calendar, Users, FileText, Plus, 
  Edit2, Save, X, ChevronDown, ChevronUp, Clock, CheckCircle,
  AlertCircle, Star, Send, Trash2, Tag, Activity
} from 'lucide-react'
import useParentStore from '@store/parentStore'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import clsx from 'clsx'

// Inline Edit Component
const InlineEdit = ({ value, onSave, onCancel, type = 'text', options = [] }) => {
  const [editValue, setEditValue] = useState(value)
  
  const handleSave = () => {
    onSave(editValue)
  }
  
  if (type === 'select') {
    return (
      <div className="flex items-center gap-2">
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={handleSave} className="p-1 text-green-600 hover:text-green-700">
          <Save className="h-4 w-4" />
        </button>
        <button onClick={onCancel} className="p-1 text-gray-600 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
      />
      <button onClick={handleSave} className="p-1 text-green-600 hover:text-green-700">
        <Save className="h-4 w-4" />
      </button>
      <button onClick={onCancel} className="p-1 text-gray-600 hover:text-gray-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Task Component
const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdate(task.id, { completed: !task.completed })}
          className={clsx(
            'w-5 h-5 rounded border-2 flex items-center justify-center',
            task.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
        </button>
        <div>
          {isEditing ? (
            <InlineEdit
              value={task.title}
              onSave={(value) => {
                onUpdate(task.id, { title: value })
                setIsEditing(false)
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div>
              <p className={clsx(
                'font-medium',
                task.completed && 'line-through text-gray-500'
              )}>
                {task.title}
              </p>
              {task.due_date && (
                <p className="text-sm text-gray-600">
                  Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-600 hover:text-gray-700"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Email Preview Component
const EmailPreview = ({ email, onViewFull }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {email.direction === 'inbound' ? (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              ) : (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
              <p className="font-medium text-gray-900">{email.subject}</p>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {email.direction === 'inbound' ? 'From' : 'To'}: {email.from_address}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              {format(new Date(email.date_received), 'MMM d, yyyy h:mm a')}
            </p>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{email.body_preview || 'No preview available'}</p>
          </div>
          <button
            onClick={() => onViewFull(email)}
            className="mt-3 text-sm text-brand-blue hover:text-brand-blue-hover"
          >
            View full email →
          </button>
        </div>
      )}
    </div>
  )
}

// Journey Timeline Component
const JourneyTimeline = ({ events }) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex items-start gap-4 pb-6">
          <div className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center z-10',
            event.type === 'email' ? 'bg-blue-100 text-blue-600' :
            event.type === 'note' ? 'bg-gray-100 text-gray-600' :
            event.type === 'status_change' ? 'bg-green-100 text-green-600' :
            'bg-purple-100 text-purple-600'
          )}>
            {event.type === 'email' ? <Mail className="h-4 w-4" /> :
             event.type === 'note' ? <FileText className="h-4 w-4" /> :
             event.type === 'status_change' ? <Activity className="h-4 w-4" /> :
             <Clock className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{event.title}</p>
            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Child Form Component
const ChildForm = ({ child, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: child?.name || '',
    current_year_group: child?.current_year_group || '',
    target_year_group: child?.target_year_group || '',
    interests: child?.interests || '',
    notes: child?.notes || ''
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Child's Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Year Group
          </label>
          <select
            value={formData.current_year_group}
            onChange={(e) => setFormData({ ...formData, current_year_group: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          >
            <option value="">Select...</option>
            {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Year Group
          </label>
          <select
            value={formData.target_year_group}
            onChange={(e) => setFormData({ ...formData, target_year_group: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          >
            <option value="">Select...</option>
            {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Interests
        </label>
        <input
          type="text"
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          placeholder="e.g., Reading, Sports, Music"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
          rows={3}
        />
      </div>
      
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-hover"
        >
          {child ? 'Update Child' : 'Add Child'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ParentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    selectedParent, 
    loading, 
    fetchParentDetails, 
    updateParent,
    addNote,
    addTask,
    updateTask,
    deleteTask,
    addChild,
    updateChild,
    deleteChild,
    fetchEmails,
    fetchJourneyEvents
  } = useParentStore()
  
  const [editingField, setEditingField] = useState(null)
  const [noteContent, setNoteContent] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [editingChild, setEditingChild] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [journeyEvents, setJourneyEvents] = useState([])
  const [emails, setEmails] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchParentDetails(id)
    fetchEmails(id).then(setEmails)
    fetchJourneyEvents(id).then(setJourneyEvents)
  }, [id])

  const handleFieldUpdate = async (field, value) => {
    try {
      await updateParent(id, { [field]: value })
      setEditingField(null)
      toast.success('Updated successfully')
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const handleAddNote = async () => {
    if (!noteContent.trim()) return
    
    try {
      await addNote(id, noteContent)
      setNoteContent('')
      setIsAddingNote(false)
      toast.success('Note added successfully')
      fetchParentDetails(id) // Refresh data
    } catch (error) {
      toast.error('Failed to add note')
    }
  }

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return
    
    try {
      await addTask(id, { title: taskTitle })
      setTaskTitle('')
      setIsAddingTask(false)
      toast.success('Task added successfully')
      fetchParentDetails(id)
    } catch (error) {
      toast.error('Failed to add task')
    }
  }

  const handleSaveChild = async (childData) => {
    try {
      if (editingChild) {
        await updateChild(editingChild.id, childData)
        toast.success('Child updated successfully')
      } else {
        await addChild(id, childData)
        toast.success('Child added successfully')
      }
      setIsAddingChild(false)
      setEditingChild(null)
      fetchParentDetails(id)
    } catch (error) {
      toast.error('Failed to save child')
    }
  }

  const handleDeleteChild = async (childId) => {
    if (!confirm('Are you sure you want to delete this child?')) return
    
    try {
      await deleteChild(childId)
      toast.success('Child deleted successfully')
      fetchParentDetails(id)
    } catch (error) {
      toast.error('Failed to delete child')
    }
  }

  if (loading || !selectedParent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    )
  }

  const statusOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'warm', label: 'Warm' },
    { value: 'applicant', label: 'Applicant' },
    { value: 'offer_made', label: 'Offer Made' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'lost', label: 'Lost' }
  ]

  const stageOptions = [
    { value: 'initial_enquiry', label: 'Initial Enquiry' },
    { value: 'school_visit', label: 'School Visit' },
    { value: 'application', label: 'Application' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'decision', label: 'Decision' },
    { value: 'enrolled', label: 'Enrolled' }
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/parents')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  {editingField === 'name' ? (
                    <InlineEdit
                      value={selectedParent.name}
                      onSave={(value) => handleFieldUpdate('name', value)}
                      onCancel={() => setEditingField(null)}
                    />
                  ) : (
                    <>
                      <h1 className="text-2xl font-serif text-gray-900">{selectedParent.name}</h1>
                      <button
                        onClick={() => setEditingField('name')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">ID: {selectedParent.parent_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {editingField === 'status' ? (
                <InlineEdit
                  type="select"
                  value={selectedParent.status}
                  options={statusOptions}
                  onSave={(value) => handleFieldUpdate('status', value)}
                  onCancel={() => setEditingField(null)}
                />
              ) : (
                <>
                  <span className={clsx(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    selectedParent.status === 'enrolled' ? 'bg-blue-100 text-blue-800' :
                    selectedParent.status === 'offer_made' ? 'bg-green-100 text-green-800' :
                    selectedParent.status === 'applicant' ? 'bg-purple-100 text-purple-800' :
                    selectedParent.status === 'warm' ? 'bg-orange-100 text-orange-800' :
                    selectedParent.status === 'lost' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {selectedParent.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => setEditingField('status')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-6 border-t border-gray-200">
          {['overview', 'communications', 'journey', 'tasks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors',
                activeTab === tab
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      {editingField === 'email' ? (
                        <InlineEdit
                          type="email"
                          value={selectedParent.email || ''}
                          onSave={(value) => handleFieldUpdate('email', value)}
                          onCancel={() => setEditingField(null)}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{selectedParent.email || 'Not provided'}</p>
                          <button
                            onClick={() => setEditingField('email')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Phone</p>
                      {editingField === 'phone' ? (
                        <InlineEdit
                          type="tel"
                          value={selectedParent.phone || ''}
                          onSave={(value) => handleFieldUpdate('phone', value)}
                          onCancel={() => setEditingField(null)}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{selectedParent.phone || 'Not provided'}</p>
                          <button
                            onClick={() => setEditingField('phone')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">First Contact</p>
                      <p className="font-medium">
                        {selectedParent.first_contact_date 
                          ? format(new Date(selectedParent.first_contact_date), 'MMM d, yyyy')
                          : 'Not recorded'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Stage</p>
                      {editingField === 'stage' ? (
                        <InlineEdit
                          type="select"
                          value={selectedParent.stage}
                          options={stageOptions}
                          onSave={(value) => handleFieldUpdate('stage', value)}
                          onCancel={() => setEditingField(null)}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{selectedParent.stage.replace('_', ' ')}</p>
                          <button
                            onClick={() => setEditingField('stage')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Lead Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={clsx(
                                'h-4 w-4',
                                star <= (selectedParent.lead_score / 20)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{selectedParent.lead_score}/100</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Engagement Score</p>
                      <div className="mt-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={clsx(
                                'h-2 rounded-full',
                                selectedParent.engagement_score >= 70 ? 'bg-green-500' :
                                selectedParent.engagement_score >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              )}
                              style={{ width: `${selectedParent.engagement_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedParent.engagement_score}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Source</p>
                      <p className="font-medium mt-1">{selectedParent.source || 'Direct'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Children */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Children</h2>
                  <button
                    onClick={() => setIsAddingChild(true)}
                    className="text-sm text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Child
                  </button>
                </div>

                {isAddingChild && (
                  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <ChildForm
                      onSave={handleSaveChild}
                      onCancel={() => setIsAddingChild(false)}
                    />
                  </div>
                )}

                {editingChild && (
                  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                    <ChildForm
                      child={editingChild}
                      onSave={handleSaveChild}
                      onCancel={() => setEditingChild(null)}
                    />
                  </div>
                )}

                {selectedParent.children && selectedParent.children.length > 0 ? (
                  <div className="space-y-3">
                    {selectedParent.children.map((child) => (
                      <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{child.name}</h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">
                                Current: {child.current_year_group || 'Not specified'}
                                {child.target_year_group && ` → Target: ${child.target_year_group}`}
                              </p>
                              {child.interests && (
                                <p className="text-sm text-gray-600">
                                  Interests: {child.interests}
                                </p>
                              )}
                              {child.notes && (
                                <p className="text-sm text-gray-500 italic mt-2">
                                  {child.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingChild(child)}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteChild(child.id)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isAddingChild && <p className="text-gray-500">No children added yet</p>
                )}
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                  <button
                    onClick={() => setIsAddingNote(true)}
                    className="text-sm text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Note
                  </button>
                </div>
                
                {isAddingNote && (
                  <div className="mb-4 space-y-3">
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Enter your note..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNote}
                        className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-md hover:bg-brand-blue-hover"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingNote(false)
                          setNoteContent('')
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedParent.recent_notes && selectedParent.recent_notes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedParent.recent_notes.map((note) => (
                      <div key={note.id} className="border-b border-gray-100 pb-3 last:border-0">
                        <p className="text-gray-900">{note.content}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {note.created_by} • {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  !isAddingNote && <p className="text-gray-500">No notes yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="space-y-6">
              {/* Email History */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Email History</h2>
                  <button className="text-sm text-brand-blue hover:text-brand-blue-hover flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    Send Email
                  </button>
                </div>

                {emails.length > 0 ? (
                  <div className="space-y-3">
                    {emails.map((email) => (
                      <EmailPreview
                        key={email.id}
                        email={email}
                        onViewFull={(email) => setSelectedEmail(email)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No emails found</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="space-y-6">
              {/* Journey Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Journey Timeline</h2>
                {journeyEvents.length > 0 ? (
                  <JourneyTimeline events={journeyEvents} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No journey events yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Tasks */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="text-sm text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                </div>

                {isAddingTask && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Task title..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue"
                    />
                    <button
                      onClick={handleAddTask}
                      className="px-4 py-2 bg-brand-blue text-white font-medium rounded-md hover:bg-brand-blue-hover"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingTask(false)
                        setTaskTitle('')
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {selectedParent.tasks && selectedParent.tasks.length > 0 ? (
                  <div className="space-y-2">
                    {selectedParent.tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                ) : (
                  !isAddingTask && <p className="text-gray-500">No tasks yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}