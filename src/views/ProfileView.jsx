// src/views/ProfileView.jsx
import React, { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent,
  Avatar, Chip, Button, IconButton, Skeleton,
  List, ListItem, ListItemIcon, ListItemText, Divider,
  TextField, CircularProgress
} from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PhoneIcon         from '@mui/icons-material/Phone'
import EmailIcon         from '@mui/icons-material/Email'
import ApartmentIcon     from '@mui/icons-material/Apartment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AddIcon           from '@mui/icons-material/Add'
import DeleteIcon        from '@mui/icons-material/Delete'
import EditIcon          from '@mui/icons-material/Edit'
import LogoutIcon        from '@mui/icons-material/Logout'
import CheckCircleIcon   from '@mui/icons-material/CheckCircle'
import { useSnackbar } from 'notistack'
import AppLayout   from '@/components/AppLayout'
import C4DModal    from '@/components/C4DModal'
import { useAuthStore } from '@/store/authStore'
import api from '@/api/axios'

export default function ProfileView() {
  const { user, logout } = useAuthStore()
  const { enqueueSnackbar } = useSnackbar()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  // Modals
  const [editOpen,  setEditOpen]  = useState(false)
  const [carOpen,   setCarOpen]   = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)

  // Form state
  const [editForm, setEditForm] = useState({ full_name: '', block_name: '', flat_number: '' })
  const [newCar,   setNewCar]   = useState('')
  const [newPhone, setNewPhone] = useState('')

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    setLoading(true)
    const { data } = await api.get('/users/profile/')
    setProfile(data)
    setEditForm({ full_name: data.full_name || '', block_name: data.block_name || '', flat_number: data.flat_number || '' })
    setLoading(false)
  }

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

  async function saveProfile() {
    setSaving(true)
    try {
      await api.put('/users/profile/', editForm)
      await fetchProfile()
      setEditOpen(false)
      enqueueSnackbar('Profile updated!', { variant: 'success' })
    } catch { enqueueSnackbar('Update failed', { variant: 'error' }) }
    finally { setSaving(false) }
  }

  async function addCar() {
    if (!newCar.trim()) return
    setSaving(true)
    try {
      await api.post('/cars/', { plate_number: newCar.trim().toUpperCase() })
      await fetchProfile()
      setCarOpen(false); setNewCar('')
      enqueueSnackbar('Car added!', { variant: 'success' })
    } catch (e) { enqueueSnackbar(e.response?.data?.error || 'Failed to add car', { variant: 'error' }) }
    finally { setSaving(false) }
  }

  async function deleteCar(id) {
    if (!confirm('Remove this car?')) return
    try {
      await api.delete(`/cars/${id}/`)
      await fetchProfile()
      enqueueSnackbar('Car removed', { variant: 'success' })
    } catch { enqueueSnackbar('Failed to remove', { variant: 'error' }) }
  }

  async function addPhone() {
    if (!newPhone.trim()) return
    setSaving(true)
    try {
      await api.post('/users/mobiles/', { number: newPhone.trim() })
      await fetchProfile()
      setPhoneOpen(false); setNewPhone('')
      enqueueSnackbar('Mobile added!', { variant: 'success' })
    } catch (e) { enqueueSnackbar(e.response?.data?.error || 'Failed to add', { variant: 'error' }) }
    finally { setSaving(false) }
  }

  async function deletePhone(id) {
    if (!confirm('Remove this mobile?')) return
    try {
      await api.delete(`/users/mobiles/${id}/`)
      await fetchProfile()
      enqueueSnackbar('Mobile removed', { variant: 'success' })
    } catch (e) { enqueueSnackbar(e.response?.data?.error || 'Failed', { variant: 'error' }) }
  }

  return (
    <AppLayout>
      {/* Hero Banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
        p: 3, textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', left: -20, bottom: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <Avatar sx={{
          width: 72, height: 72, mx: 'auto', mb: 1.5, fontSize: '1.8rem', fontWeight: 700,
          bgcolor: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)',
          fontFamily: "'Syne',sans-serif",
        }}>
          {loading ? '?' : (profile?.full_name?.[0] || 'U')}
        </Avatar>
        {loading ? (
          <Skeleton width={160} height={28} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', fontFamily: "'Syne',sans-serif" }}>
            {profile?.full_name}
          </Typography>
        )}
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', mt: 0.25 }}>
          Block {profile?.block_name} • Flat {profile?.flat_number}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1.5 }}>
          <Chip label="✓ Verified" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600 }} />
          <Chip label={profile?.role === 'admin' ? '🛡 Admin' : '🏠 Resident'} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600 }} />
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ py: 2.5 }}>
        {/* My Vehicles */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>🚗 My Vehicles</Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setCarOpen(true)} sx={{ textTransform: 'none', fontWeight: 700 }}>Add Car</Button>
        </Box>

        {loading ? [1, 2].map(i => <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 2, mb: 1.5 }} />) :
          profile?.cars?.length ? profile.cars.map(car => (
            <Card key={car.id} sx={{ mb: 1.5 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: t => t.palette.mode === 'dark' ? 'rgba(45,212,191,0.12)' : 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <DirectionsCarIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.9rem' }}>{car.plate_number}</Typography>
                  <Typography variant="caption" color="text.disabled">Suffix: {car.plate_suffix}</Typography>
                </Box>
                <IconButton size="small" color="error" onClick={() => deleteCar(car.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardContent>
            </Card>
          )) : (
            <Card sx={{ textAlign: 'center', py: 4, mb: 2 }}>
              <DirectionsCarIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No vehicles added</Typography>
            </Card>
          )
        }

        {/* Mobile Numbers */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Syne',sans-serif" }}>📱 Mobile Numbers</Typography>
          {(profile?.mobiles?.length || 0) < 3 && (
            <Button size="small" startIcon={<AddIcon />} onClick={() => setPhoneOpen(true)} sx={{ textTransform: 'none', fontWeight: 700 }}>Add</Button>
          )}
        </Box>

        {loading ? [1].map(i => <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 2, mb: 1.5 }} />) :
          profile?.mobiles?.map(mob => (
            <Card key={mob.id} sx={{ mb: 1.5 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: t => t.palette.mode === 'dark' ? 'rgba(74,222,128,0.12)' : 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneIcon sx={{ color: 'success.main', fontSize: 20 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.92rem' }}>{mob.number}</Typography>
                  {mob.is_primary && <Chip label="Primary" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: '0.68rem' }} />}
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" component="a" href={`tel:${mob.number}`} sx={{ color: 'success.main' }}>
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                  {(profile?.mobiles?.length || 0) > 1 && (
                    <IconButton size="small" color="error" onClick={() => deletePhone(mob.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        }

        {/* Account Info */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: "'Syne',sans-serif", mt: 1, mb: 1.5 }}>ℹ️ Account Info</Typography>
        <Card sx={{ mb: 2.5 }}>
          <List dense disablePadding>
            <ListItem divider>
              <ListItemIcon sx={{ minWidth: 40 }}><EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</Typography>} secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>{profile?.email}</Typography>} />
            </ListItem>
            <ListItem divider>
              <ListItemIcon sx={{ minWidth: 40 }}><ApartmentIcon sx={{ color: 'primary.main', fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Block & Flat</Typography>} secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>Block {profile?.block_name} – Flat {profile?.flat_number}</Typography>} />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 40 }}><CalendarTodayIcon sx={{ color: 'primary.main', fontSize: 20 }} /></ListItemIcon>
              <ListItemText primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Member Since</Typography>} secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>{fmt(profile?.date_joined)}</Typography>} />
            </ListItem>
          </List>
        </Card>

        {/* Action Buttons */}
        <Button variant="outlined" fullWidth startIcon={<EditIcon />} onClick={() => setEditOpen(true)} sx={{ mb: 1.5, borderRadius: 2.5, py: 1.25 }}>
          Edit Profile
        </Button>
        <Button variant="outlined" color="error" fullWidth startIcon={<LogoutIcon />} onClick={logout} sx={{ borderRadius: 2.5, py: 1.25 }}>
          Sign Out
        </Button>
      </Container>

      {/* Edit Profile Modal */}
      <C4DModal open={editOpen} onClose={() => setEditOpen(false)} title="✏️ Edit Profile">
        <TextField
          label="Full Name" fullWidth value={editForm.full_name}
          onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Society Block" fullWidth value={editForm.block_name}
          onChange={e => setEditForm(f => ({ ...f, block_name: e.target.value }))}
          placeholder="e.g. A, B, Tower-1"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Flat Number" fullWidth value={editForm.flat_number}
          onChange={e => setEditForm(f => ({ ...f, flat_number: e.target.value }))}
          placeholder="e.g. 101, A-204"
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" fullWidth onClick={saveProfile} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </Box>
      </C4DModal>

      {/* Add Car Modal */}
      <C4DModal open={carOpen} onClose={() => setCarOpen(false)} title="🚗 Add Vehicle">
        <TextField
          label="Car Number Plate" fullWidth value={newCar}
          onChange={e => setNewCar(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && addCar()}
          placeholder="MH 12 AB 3456" inputProps={{ style: { textAlign: 'center', letterSpacing: '0.15em', fontWeight: 700 } }}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setCarOpen(false)}>Cancel</Button>
          <Button variant="contained" fullWidth onClick={addCar} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add Car'}
          </Button>
        </Box>
      </C4DModal>

      {/* Add Phone Modal */}
      <C4DModal open={phoneOpen} onClose={() => setPhoneOpen(false)} title="📱 Add Mobile">
        <TextField
          label="Mobile Number" fullWidth type="tel" value={newPhone}
          onChange={e => setNewPhone(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addPhone()}
          placeholder="+91 98765 43210" sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setPhoneOpen(false)}>Cancel</Button>
          <Button variant="contained" fullWidth onClick={addPhone} disabled={saving}>
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Add Mobile'}
          </Button>
        </Box>
      </C4DModal>
    </AppLayout>
  )
}
