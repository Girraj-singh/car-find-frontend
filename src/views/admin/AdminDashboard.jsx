// src/views/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CardActionArea, Avatar, Chip, Skeleton
} from '@mui/material'
import PeopleIcon          from '@mui/icons-material/People'
import DirectionsCarIcon   from '@mui/icons-material/DirectionsCar'
import SearchIcon          from '@mui/icons-material/Search'
import BlockIcon           from '@mui/icons-material/Block'
import ArrowForwardIcon    from '@mui/icons-material/ArrowForward'
import AdminLayout from '@/components/AdminLayout'
import { useAuthStore } from '@/store/authStore'
import api from '@/api/axios'

const STAT_CARDS = [
  { key: 'total_users',    label: 'Total Users',     icon: PeopleIcon,        color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)' },
  { key: 'total_cars',     label: 'Registered Cars', icon: DirectionsCarIcon, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
  { key: 'searches_today', label: 'Searches Today',  icon: SearchIcon,        color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { key: 'blocked_users',  label: 'Blocked Users',   icon: BlockIcon,         color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
]

const QUICK_LINKS = [
  { icon: '👥', label: 'Users',     path: '/admin/users' },
  { icon: '🚗', label: 'Cars',      path: '/admin/cars' },
  { icon: '📋', label: 'Audit Logs', path: '/admin/logs' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [stats,        setStats]        = useState(null)
  const [recentUsers,  setRecentUsers]  = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    api.get('/admin/stats/').then(r => { setStats(r.data); setLoadingStats(false) })
    api.get('/admin/users/').then(r => { setRecentUsers(r.data.slice(0, 5)); setLoadingUsers(false) })
  }, [])

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ py: 2.5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "sans-serif" }}>Admin Dashboard 🛡</Typography>
          <Typography variant="body2" color="text.secondary">Society C4D Management Panel</Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {STAT_CARDS.map(s => {
            const Icon = s.icon
            return (
              <Grid item xs={6} sm={3} key={s.key}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon sx={{ color: s.color, fontSize: 22 }} />
                    </Box>
                    <Box>
                      {loadingStats ? <Skeleton width={40} height={28} /> : (
                        <Typography sx={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>{stats?.[s.key] ?? '—'}</Typography>
                      )}
                      <Typography variant="caption" color="text.disabled">{s.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* Quick Links */}
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {QUICK_LINKS.map(l => (
            <Grid item xs={4} key={l.path}>
              <Card sx={{ '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
                <CardActionArea onClick={() => navigate(l.path)} sx={{ py: 2.5, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.8rem', mb: 0.5 }}>{l.icon}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Syne',sans-serif" }}>{l.label}</Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Registrations */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>👥 Recent Registrations</Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}
            onClick={() => navigate('/admin/users')}>
            View All <ArrowForwardIcon fontSize="small" />
          </Typography>
        </Box>

        {loadingUsers ? [1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 2, mb: 1.5 }} />) :
          recentUsers.map(u => (
            <Card key={u.id} sx={{ mb: 1.5, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' }, transition: 'border-color 0.2s' }}
              onClick={() => navigate(`/admin/users/${u.id}`)}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Avatar sx={{
                  width: 44, height: 44, fontWeight: 800, fontFamily: "'Syne',sans-serif", fontSize: '1rem',
                  bgcolor: u.is_active ? 'rgba(45,212,191,0.12)' : 'rgba(248,113,113,0.12)',
                  color: u.is_active ? 'primary.main' : 'error.main',
                }}>
                  {u.full_name[0]}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{u.full_name}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email} · Block {u.block_name} – {u.flat_number}
                  </Typography>
                </Box>
                <Chip
                  label={u.is_active ? 'Active' : 'Blocked'} size="small"
                  color={u.is_active ? 'success' : 'error'} variant="outlined"
                />
              </CardContent>
            </Card>
          ))
        }
      </Container>
    </AdminLayout>
  )
}
