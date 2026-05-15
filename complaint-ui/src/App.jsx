import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ErrorPageComponent from './components/ErrorPageComponent'
import AuthGuard from './core/guards/AuthGuard'

import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

import UserDashboard from './pages/user/UserDashboard'
import UserComplaints from './pages/user/UserComplaints'
import ComplaintDetails from './pages/user/ComplaintDetails'
import ComplaintDetailsIndex from './pages/user/ComplaintDetailsIndex'
import UserProfile from './pages/user/UserProfile'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/user/*" element={
        <AuthGuard allowedRole="user">
          <UserLayout>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="my-complaints" element={<UserComplaints />} />
                <Route path="complaints-details/:id" element={<ComplaintDetails />} />
                <Route path="complaints-details" element={<ComplaintDetailsIndex />} />
                <Route path="profile" element={<UserProfile />} />
              </Routes>
          </UserLayout>
        </AuthGuard>
      }/>

      <Route path="/admin/*" element={
        <AuthGuard allowedRole="admin">
          <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="complaints" element={<AdminComplaints />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Routes>
          </AdminLayout>
        </AuthGuard>
      }/>

      <Route path="*" element={<ErrorPageComponent status={404} />} />
      
    </Routes>
  )
}
