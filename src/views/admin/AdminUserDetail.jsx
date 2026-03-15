// src/views/admin/AdminUserDetail.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Container, Typography, Card, Avatar, Chip, Button,
  List, ListItem, ListItemIcon, ListItemText, Grid, CircularProgress, Skeleton
} from '@mui/material'
import ArrowBackIcon   from '@mui/icons-material/ArrowBack'
import BlockIcon       from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon      from '@mui/icons-material/Delete'
import PhoneIcon       from '@mui/icons-material/Phone'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import EmailIcon       from '@mui/icons-material/Email'
import ApartmentIcon   from '@mui/icons-material/Apartment'
import { useSnackbar } from 'notistack'
import AdminLayout from '@/components/AdminLayout'
import api from '@/api/axios'

export default function AdminUserDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [user,     setUser]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [actioning, setActioning] = useState(false)

  useEffect(() => {
    api.get(`/admin/users/${id}/`).then(r => { setUser(r.data); setLoading(false) })
  }, [id])

  async function suspend() {
    setActioning(true)
    try {
      await api.post(`/admin/users/${id}/suspend/`)
      setUser(u => ({ ...u, is_active: false }))
      enqueueSnackbar('User suspended', { variant: 'success' })
    } finally { setActioning(false) }
  }

  async function activate() {
    setActioning(true)
    try {
      await api.post(`/admin/users/${id}/activate/`)
      setUser(u => ({ ...u, is_active: true }))
      enqueueSnackbar('User activated', { variant: 'success' })
    } finally { setActioning(false) }
  }

  async function deleteUser() {
    if (!confirm('Delete permanently?')) return
    setActioning(true)
    try {
      await api.delete(`/admin/users/${id}/`)
      enqueueSnackbar('User deleted', { variant: 'success' })
      navigate('/admin/users')
    } finally { setActioning(false) }
  }

  return (
    <AdminLayout>
      <Container maxWidth="sm" sx={{ py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/users')} variant="outlined" size="small">Back</Button>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>User Detail</Typography>
        </Box>

        {loading ? [1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 2, mb: 1.5 }} />) : user && (
          <>
            {/* User Header Card */}
            <Card sx={{ mb: 2 }}>
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{
                  width: 56, height: 56, fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Syne',sans-serif",
                  bgcolor: user.is_active ? 'rgba(45,212,191,0.12)' : 'rgba(248,113,113,0.12)',
                  color: user.is_active ? 'primary.main' : 'error.main',
                }}>{user.full_name[0]}</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>{user.full_name}</Typography>
                  <Chip label={user.is_active ? '✓ Active' : '🚫 Suspended'} size="small"
                    color={user.is_active ? 'success' : 'error'} variant="outlined" sx={{ mt: 0.5 }} />
                </Box>
              </Box>

              <List dense disablePadding>
                <ListItem divider>
                  <ListItemIcon sx={{ minWidth: 38 }}><EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} /></ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</Typography>}
                    secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>{user.email}</Typography>}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemIcon sx={{ minWidth: 38 }}><ApartmentIcon sx={{ color: 'primary.main', fontSize: 20 }} /></ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Location</Typography>}
                    secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>Block {user.block_name} – Flat {user.flat_number}</Typography>}
                  />
                </ListItem>
                {user.mobiles?.length > 0 && (
                  <ListItem divider>
                    <ListItemIcon sx={{ minWidth: 38 }}><PhoneIcon sx={{ color: 'success.main', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mobile Numbers</Typography>}
                      secondary={user.mobiles.map(m => (
                        <Typography key={m.id} sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>{m.number}</Typography>
                      ))}
                    />
                  </ListItem>
                )}
                {user.cars?.length > 0 && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 38 }}><DirectionsCarIcon sx={{ color: 'secondary.main', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vehicles</Typography>}
                      secondary={user.cars.map(c => (
                        <Typography key={c.id} sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', letterSpacing: '0.08em', fontFamily: 'monospace' }}>{c.plate_number}</Typography>
                      ))}
                    />
                  </ListItem>
                )}
              </List>
            </Card>

            {/* Action Buttons */}
            <Grid container spacing={1.5}>
              {user.is_active ? (
                <Grid item xs={6}>
                  <Button fullWidth variant="outlined" color="error" size="large"
                    startIcon={actioning ? <CircularProgress size={16} /> : <BlockIcon />}
                    onClick={suspend} disabled={actioning} sx={{ borderRadius: 2.5, py: 1.25 }}>
                    Suspend User
                  </Button>
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <Button fullWidth variant="outlined" color="success" size="large"
                    startIcon={actioning ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                    onClick={activate} disabled={actioning} sx={{ borderRadius: 2.5, py: 1.25 }}>
                    Activate User
                  </Button>
                </Grid>
              )}
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" color="error" size="large"
                  startIcon={actioning ? <CircularProgress size={16} /> : <DeleteIcon />}
                  onClick={deleteUser} disabled={actioning} sx={{ borderRadius: 2.5, py: 1.25 }}>
                  Delete User
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </AdminLayout>
  )
}
