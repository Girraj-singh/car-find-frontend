// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { darkTheme, lightTheme } from '@/theme'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'

// Auth Views
import LandingView        from '@/views/LandingView'
import RegisterView       from '@/views/auth/RegisterView'
import OtpView            from '@/views/auth/OtpView'
import ProfileSetupView   from '@/views/auth/ProfileSetupView'
import LoginView          from '@/views/auth/LoginView'

// User Views
import DashboardView    from '@/views/DashboardView'
import SearchView       from '@/views/SearchView'
import QRGeneratorView  from '@/views/QRGeneratorView'
import ProfileView      from '@/views/ProfileView'
import SuspendedView    from '@/views/SuspendedView'

// Admin Views
import AdminDashboard  from '@/views/admin/AdminDashboard'
import AdminUsers      from '@/views/admin/AdminUsers'
import AdminUserDetail from '@/views/admin/AdminUserDetail'
import AdminCars       from '@/views/admin/AdminCars'
import AdminLogs       from '@/views/admin/AdminLogs'

function PrivateRoute({ children }) {
  const { access, user } = useAuthStore()
  if (!access || !user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { access, user } = useAuthStore()
  if (!access || !user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function GuestRoute({ children }) {
  const { access, user } = useAuthStore()
  if (access && user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  return children
}

export default function App() {
  const mode  = useThemeStore(s => s.mode)
  const theme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={4} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={3500}>
        <BrowserRouter>
          <Routes>
            {/* Guest */}
            <Route path="/"                 element={<GuestRoute><LandingView /></GuestRoute>} />
            <Route path="/register"         element={<GuestRoute><RegisterView /></GuestRoute>} />
            <Route path="/register/otp"     element={<GuestRoute><OtpView /></GuestRoute>} />
            <Route path="/register/profile" element={<GuestRoute><ProfileSetupView /></GuestRoute>} />
            <Route path="/login"            element={<GuestRoute><LoginView /></GuestRoute>} />

            {/* User */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardView /></PrivateRoute>} />
            <Route path="/search"    element={<PrivateRoute><SearchView /></PrivateRoute>} />
            <Route path="/my-qr"     element={<PrivateRoute><QRGeneratorView /></PrivateRoute>} />
            <Route path="/profile"   element={<PrivateRoute><ProfileView /></PrivateRoute>} />
            <Route path="/suspended" element={<SuspendedView />} />

            {/* Admin */}
            <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
            <Route path="/admin/cars"      element={<AdminRoute><AdminCars /></AdminRoute>} />
            <Route path="/admin/logs"      element={<AdminRoute><AdminLogs /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
