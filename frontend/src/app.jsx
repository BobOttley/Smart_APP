// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@components/Layout'
import ParentsModule from '@modules/parents/ParentsModule'
import InboxModule from '@modules/inbox/InboxModule'
import SmartReplyModule from '@modules/smart-reply/SmartReplyModule'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/parents" replace />} />
        <Route path="parents/*" element={<ParentsModule />} />
        <Route path="inbox/*" element={<InboxModule />} />
        <Route path="smart-reply/*" element={<SmartReplyModule />} />
      </Route>
    </Routes>
  )
}

export default App