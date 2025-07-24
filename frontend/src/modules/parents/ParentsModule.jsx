// src/modules/parents/ParentsModule.jsx
import { Routes, Route } from 'react-router-dom'
import ParentsList from './components/ParentsList'
import ParentDetail from './components/ParentDetail'

export default function ParentsModule() {
  return (
    <div className="h-full flex flex-col">
      <Routes>
        <Route index element={<ParentsList />} />
        <Route path=":id" element={<ParentDetail />} />
      </Routes>
    </div>
  )
}