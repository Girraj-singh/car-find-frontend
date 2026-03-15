// src/components/AuthLayout.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Typography, IconButton, Container, Paper
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DarkModeIcon  from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useThemeStore } from '@/store/themeStore'

export default function AuthLayout({ children, title, subtitle, icon, step = 0 }) {
  const navigate = useNavigate()
  const { mode, toggleTheme } = useThemeStore()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important', px: 2 }}>
          {step > 0 ? (
            <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: 'text.primary' }}>
              <ArrowBackIcon />
            </IconButton>
          ) : <Box sx={{ width: 36 }} />}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
            }}>🚗</Box>
            <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>
              C4D<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
            </Typography>
          </Box>

          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 4 }}>
        <Box sx={{ width: '100%' }}>
          {/* Step dots */}
          {step > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mb: 3 }}>
              {[1, 2, 3].map(i => (
                <Box key={i} sx={{
                  height: 8, borderRadius: 4,
                  width: i === step ? 24 : 8,
                  bgcolor: i < step ? 'success.main' : i === step ? 'primary.main' : 'divider',
                  transition: 'all 0.3s',
                }} />
              ))}
            </Box>
          )}

          <Paper sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3.5 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3.5 }}>
              <Box sx={{
                width: 60, height: 60, borderRadius: '16px', mx: 'auto', mb: 1.5,
                background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', boxShadow: '0 0 20px rgba(45,212,191,0.3)',
              }}>
                {icon}
              </Box>
              <Typography variant="h5" sx={{ fontFamily: "sans-serif",fontWeight: 700, mb: 0.5 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Box>

            {children}
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
