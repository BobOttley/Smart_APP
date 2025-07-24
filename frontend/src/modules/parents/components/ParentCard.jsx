// src/modules/parents/components/ParentCard.jsx
import { Mail, Phone, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import clsx from 'clsx'

const statusColors = {
  lead: 'bg-gray-100 text-gray-800',
  warm: 'bg-orange-100 text-orange-800',
  applicant: 'bg-purple-100 text-purple-800',
  offer_made: 'bg-green-100 text-green-800',
  enrolled: 'bg-blue-100 text-blue-800',
  lost: 'bg-red-100 text-red-800',
}

const getSentimentIcon = (score) => {
  if (score >= 70) return { icon: TrendingUp, color: 'text-green-500' }
  if (score <= 30) return { icon: TrendingDown, color: 'text-red-500' }
  return { icon: Minus, color: 'text-gray-500' }
}

export default function ParentCard({ parent, onClick }) {
  const SentimentIcon = getSentimentIcon(parent.engagement_score).icon
  const sentimentColor = getSentimentIcon(parent.engagement_score).color

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{parent.name}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {parent.email || 'No email'}
            </span>
            {parent.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {parent.phone}
              </span>
            )}
          </div>
        </div>
        <span
          className={clsx(
            'px-2 py-1 text-xs font-medium rounded-full',
            statusColors[parent.status]
          )}
        >
          {parent.status.replace('_', ' ')}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{parent.lead_score}</p>
          <p className="text-xs text-gray-600">Lead Score</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center items-center">
            <SentimentIcon className={clsx('h-6 w-6', sentimentColor)} />
          </div>
          <p className="text-xs text-gray-600 mt-1">Engagement</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {parent.children?.length || 0}
          </p>
          <p className="text-xs text-gray-600">Children</p>
        </div>
      </div>

      {/* Tags */}
      {parent.tags && parent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {parent.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
            >
              {tag}
            </span>
          ))}
          {parent.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{parent.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
        <span>Stage: {parent.stage.replace('_', ' ')}</span>
        <span>{parent.source || 'Direct'}</span>
      </div>
    </div>
  )
}