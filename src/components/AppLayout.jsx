// src/components/AppLayout.jsx
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Typography, IconButton,
  BottomNavigation, BottomNavigationAction, Paper
} from '@mui/material'
import HomeIcon       from '@mui/icons-material/Home'
import SearchIcon     from '@mui/icons-material/Search'
import QrCode2Icon    from '@mui/icons-material/QrCode2'
import PersonIcon     from '@mui/icons-material/Person'
import LogoutIcon     from '@mui/icons-material/Logout'
import DarkModeIcon   from '@mui/icons-material/DarkMode'
import LightModeIcon  from '@mui/icons-material/LightMode'
import { useAuthStore }  from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const NAV_ITEMS = [
  { label: 'Home',    icon: <HomeIcon />,    path: '/dashboard' },
  { label: 'Search',  icon: <SearchIcon />,  path: '/search'    },
  { label: 'My QR',   icon: <QrCode2Icon />, path: '/my-qr'     },
  { label: 'Profile', icon: <PersonIcon />,  path: '/profile'   },
]

export default function AppLayout({ children }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { logout } = useAuthStore()
  const { mode, toggleTheme } = useThemeStore()

  const currentTab = NAV_ITEMS.findIndex(n => location.pathname === n.path)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top AppBar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', boxShadow: '0 0 14px rgba(45,212,191,0.35)',
            }}>🚗</Box>
            <Typography variant="h6" sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, letterSpacing: '-0.02em' }}>
              C4D<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
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

      {/* Page Content */}
      <Box component="main" sx={{ flex: 1, pb: '80px' }}>
        {children}
      </Box>

      {/* Bottom Navigation */}
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
