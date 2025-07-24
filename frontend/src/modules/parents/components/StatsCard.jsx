// src/modules/parents/components/StatsCard.jsx
import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

export default function StatsCard({ title, value, trend, trendUp }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <div
            className={clsx(
              'flex items-center text-sm font-medium',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trendUp ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}