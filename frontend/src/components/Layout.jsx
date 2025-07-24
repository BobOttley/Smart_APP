// src/components/Layout.jsx
import { Outlet, NavLink } from 'react-router-dom'
import { Users, Inbox, MessageSquare, BarChart, BookOpen, Calendar, Settings } from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Parents', href: '/parents', icon: Users },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Smart Reply', href: '/smart-reply', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  { name: 'Events', href: '/events', icon: Calendar },
]

export default function Layout() {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-2xl font-serif text-brand-blue">SMART Reply</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}