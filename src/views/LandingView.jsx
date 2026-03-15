// src/views/LandingView.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, Typography, Button, Container,
  Grid, Card, CardContent, IconButton, Chip
} from '@mui/material'
import DarkModeIcon    from '@mui/icons-material/DarkMode'
import LightModeIcon   from '@mui/icons-material/LightMode'
import SearchIcon      from '@mui/icons-material/Search'
import QrCodeIcon      from '@mui/icons-material/QrCode'
import PhoneIcon       from '@mui/icons-material/Phone'
import SecurityIcon    from '@mui/icons-material/Security'
import { useThemeStore } from '@/store/themeStore'

const features = [
  { icon: <SearchIcon sx={{ fontSize: 32, color: '#2dd4bf' }} />, title: 'Quick Search', desc: 'Find any car by last 4 digits of the plate number instantly' },
  { icon: <QrCodeIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />, title: 'QR Scan', desc: 'Scan QR sticker on car windshield for instant owner details' },
  { icon: <PhoneIcon sx={{ fontSize: 32, color: '#4ade80' }} />, title: 'Direct Call', desc: 'Call car owner directly from the app with one tap' },
  { icon: <SecurityIcon sx={{ fontSize: 32, color: '#fbbf24' }} />, title: 'Admin Panel', desc: 'Society admin can manage all residents and vehicles' },
]

export default function LandingView() {
  const navigate = useNavigate()
  const { mode, toggleTheme } = useThemeStore()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '56px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#2dd4bf,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 0 14px rgba(45,212,191,0.35)' }}>🚗</Box>
            <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem' }}>
              C4D<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
            <Button variant="outlined" size="small" onClick={() => navigate('/login')} sx={{ borderRadius: 2 }}>
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{ position: 'relative', overflow: 'hidden', flex: 1 }}>
        {/* Grid background */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: t => t.palette.mode === 'dark'
            ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,212,191,.1), transparent 70%)'
            : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13,148,136,.07), transparent 70%)',
        }} />
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: t => t.palette.mode === 'dark'
            ? 'linear-gradient(rgba(45,212,191,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,191,.04) 1px,transparent 1px)'
            : 'linear-gradient(rgba(13,148,136,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(13,148,136,.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Chip
            label="🏘 Society Car Finder"
            sx={{
              mb: 2.5, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em',
              bgcolor: t => t.palette.mode === 'dark' ? 'rgba(45,212,191,0.12)' : 'rgba(13,148,136,0.1)',
              color: 'primary.main', border: '1px solid', borderColor: 'primary.main',
            }}
          />

          <Typography variant="h3" sx={{ fontFamily: "sans-serif",fontWeight: 700, lineHeight: 1.15, mb: 2, letterSpacing: '-0.02em' }}>
            Find Parked Cars<br />
            <Box component="span" sx={{ color: 'primary.main' }}>Instantly</Box>
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 360, mx: 'auto', lineHeight: 1.7 }}>
            Search any car blocking your way by its last 4 plate digits or QR scan. Connect with residents directly.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
            <Button variant="contained" size="large" onClick={() => navigate('/register')}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: 2.5 }}>
              🚀 Get Started Free
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', borderRadius: 2.5 }}>
              Sign In →
            </Button>
          </Box>

          {/* Feature cards */}
          <Grid container spacing={2}>
            {features.map((f, i) => (
              <Grid item xs={6} key={i}>
                <Card sx={{ p: 0.5, textAlign: 'left', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: t => `0 0 20px ${t.palette.mode==='dark'?'rgba(45,212,191,0.2)':'rgba(13,148,136,0.15)'}` } }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ mb: 1 }}>{f.icon}</Box>
                    <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>{f.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="footer" sx={{ textAlign: 'center', py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.disabled">C4D – Car Finder for Society &nbsp;|&nbsp; Built with ❤️ for Residents</Typography>
      </Box>
    </Box>
  )
}
