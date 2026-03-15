// src/components/AdminLayout.jsx
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Typography, IconButton,
  BottomNavigation, BottomNavigationAction, Paper
} from '@mui/material'
import DashboardIcon   from '@mui/icons-material/Dashboard'
import PeopleIcon      from '@mui/icons-material/People'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ArticleIcon     from '@mui/icons-material/Article'
import LogoutIcon      from '@mui/icons-material/Logout'
import DarkModeIcon    from '@mui/icons-material/DarkMode'
import LightModeIcon   from '@mui/icons-material/LightMode'
import SecurityIcon    from '@mui/icons-material/Security'
import { useAuthStore }  from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />,      path: '/admin' },
  { label: 'Users',     icon: <PeopleIcon />,         path: '/admin/users' },
  { label: 'Cars',      icon: <DirectionsCarIcon />,  path: '/admin/cars' },
  { label: 'Logs',      icon: <ArticleIcon />,        path: '/admin/logs' },
]

export default function AdminLayout({ children }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { logout } = useAuthStore()
  const { mode, toggleTheme } = useThemeStore()

  const currentTab = NAV_ITEMS.findIndex(n =>
    n.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(n.path)
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #b388ff, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px rgba(179,136,255,0.3)',
            }}>
              <SecurityIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Typography variant="h6" sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>
              C4D <Box component="span" sx={{ color: '#b388ff' }}>Admin</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
            <IconButton onClick={logout} size="small" sx={{ color: 'text.secondary' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, pb: '80px' }}>
        {children}
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={0}>
        <BottomNavigation
          value={currentTab === -1 ? false : currentTab}
          onChange={(_, val) => navigate(NAV_ITEMS[val].path)}
        >
          {NAV_ITEMS.map(item => (
            <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
