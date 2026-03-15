// src/views/DashboardView.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Card, CardContent,
  Grid, Chip, Skeleton
} from '@mui/material'
import SearchIcon        from '@mui/icons-material/Search'
import QrCode2Icon       from '@mui/icons-material/QrCode2'
import PersonIcon        from '@mui/icons-material/Person'
import LogoutIcon        from '@mui/icons-material/Logout'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AppLayout   from '@/components/AppLayout'
import { useAuthStore } from '@/store/authStore'
import api from '@/api/axios'

export default function DashboardView() {
  const navigate  = useNavigate()
  const { user, logout } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  useEffect(() => {
    api.get('/users/profile/').then(r => { setProfile(r.data); setLoading(false) })
  }, [])

  const quickActions = [
    { icon: <SearchIcon sx={{ fontSize: 28 }} />,   label: 'Search Car', path: '/search',  color: '#2dd4bf' },
    { icon: <QrCode2Icon sx={{ fontSize: 28 }} />,  label: 'My QR Code', path: '/my-qr',   color: '#0ea5e9' },
    { icon: <PersonIcon sx={{ fontSize: 28 }} />,   label: 'My Profile', path: '/profile', color: '#4ade80' },
    { icon: <LogoutIcon sx={{ fontSize: 28 }} />,   label: 'Sign Out',   action: logout,   color: '#f87171' },
  ]

  return (
    <AppLayout>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        {/* Greeting */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary">Good {greeting},</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{user?.name || profile?.full_name || 'Resident'} 👋</Typography>
        </Box>

        {/* Quick Search Banner */}
        <Box sx={{
          borderRadius: 3.5, p: 2.5, mb: 2.5, position: 'relative', overflow: 'hidden', cursor: 'pointer',
          background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(45,212,191,0.4)' },
          transition: 'all 0.2s',
        }} onClick={() => navigate('/search')}>
          <Box sx={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <Typography sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>🔍 Quick Search</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', mb: 1.5 }}>
            Find a car blocking your way
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="By Plate Number →" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.4)', cursor: 'pointer' }} />
            <Chip label="By QR Scan →" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, border: '1.5px solid rgba(255,255,255,0.4)', cursor: 'pointer' }} />
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {[
            { val: profile?.cars?.length ?? '—', label: 'My Cars'   },
            { val: profile?.mobiles?.length ?? '—', label: 'Phones' },
            { val: profile?.block_name || '—',      label: 'Block'  },
          ].map(s => (
            <Grid item xs={4} key={s.label}>
              <Card sx={{ textAlign: 'center', p: 0.5 }}>
                <CardContent sx={{ py: 1, px: 1, '&:last-child': { pb: 1.5 } }}>
                  <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.5rem', color: 'primary.main' }}>{s.val}</Typography>
                  <Typography variant="caption" color="text.disabled">{s.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* My Vehicles */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>🚗 My Vehicles</Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/profile')}>View All</Typography>
        </Box>

        {loading ? (
          [1, 2].map(i => <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 2, mb: 1.5 }} />)
        ) : profile?.cars?.length ? (
          profile.cars.map(car => (
            <Card key={car.id} sx={{ mb: 1.5 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: t => t.palette.mode === 'dark' ? 'rgba(45,212,191,0.12)' : 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DirectionsCarIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.9rem' }}>{car.plate_number}</Typography>
                  <Typography variant="caption" color="text.disabled">Registered Vehicle</Typography>
                </Box>
                <Chip label="Active" size="small" color="success" variant="outlined" />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ textAlign: 'center', py: 4, mb: 2 }}>
            <DirectionsCarIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">No vehicles added yet</Typography>
            <Chip label="Add Vehicle" size="small" onClick={() => navigate('/profile')} sx={{ mt: 1.5, cursor: 'pointer', color: 'primary.main', borderColor: 'primary.main' }} variant="outlined" />
          </Card>
        )}

        {/* Quick Actions */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Syne',sans-serif", mb: 1.5 }}>⚡ Quick Actions</Typography>
        <Grid container spacing={1.5}>
          {quickActions.map(a => (
            <Grid item xs={6} key={a.label}>
              <Card
                sx={{ '&:hover': { borderColor: a.color, transform: 'translateY(-1px)' }, transition: 'all 0.2s', cursor: 'pointer' }}
                onClick={() => a.action ? a.action() : navigate(a.path)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ color: a.color, mb: 1 }}>{a.icon}</Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </AppLayout>
  )
}
