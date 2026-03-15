// src/views/admin/AdminUsers.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Card, CardContent, Avatar,
  TextField, MenuItem, Select, FormControl, InputLabel,
  Chip, IconButton, Skeleton, InputAdornment, Grid, Button,
  List, ListItem, ListItemText, Divider, CircularProgress
} from '@mui/material'
import SearchIcon      from '@mui/icons-material/Search'
import ArrowBackIcon   from '@mui/icons-material/ArrowBack'
import BlockIcon       from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon      from '@mui/icons-material/Delete'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PhoneIcon       from '@mui/icons-material/Phone'
import { useSnackbar } from 'notistack'
import AdminLayout from '@/components/AdminLayout'
import C4DModal    from '@/components/C4DModal'
import api from '@/api/axios'

export default function AdminUsers() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [users,        setUsers]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected,     setSelected]     = useState(null)
  const [actioning,    setActioning]    = useState(false)

  useEffect(() => {
    api.get('/admin/users/').then(r => { setUsers(r.data); setLoading(false) })
  }, [])

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    const matchStatus = !statusFilter || (statusFilter === 'active' ? u.is_active : !u.is_active)
    return matchSearch && matchStatus
  }), [users, search, statusFilter])

  async function suspend(u) {
    if (!confirm(`Suspend ${u.full_name}?`)) return
    setActioning(true)
    try {
      await api.post(`/admin/users/${u.id}/suspend/`)
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: false } : x))
      setSelected(s => s?.id === u.id ? { ...s, is_active: false } : s)
      enqueueSnackbar(`${u.full_name} suspended`, { variant: 'success' })
    } catch { enqueueSnackbar('Action failed', { variant: 'error' }) }
    finally { setActioning(false) }
  }

  async function activate(u) {
    setActioning(true)
    try {
      await api.post(`/admin/users/${u.id}/activate/`)
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_active: true } : x))
      setSelected(s => s?.id === u.id ? { ...s, is_active: true } : s)
      enqueueSnackbar(`${u.full_name} activated`, { variant: 'success' })
    } catch { enqueueSnackbar('Action failed', { variant: 'error' }) }
    finally { setActioning(false) }
  }

  async function deleteUser(u) {
    if (!confirm(`Permanently delete ${u.full_name}? This cannot be undone.`)) return
    setActioning(true)
    try {
      await api.delete(`/admin/users/${u.id}/`)
      setUsers(prev => prev.filter(x => x.id !== u.id))
      setSelected(null)
      enqueueSnackbar('User deleted', { variant: 'success' })
    } catch { enqueueSnackbar('Delete failed', { variant: 'error' }) }
    finally { setActioning(false) }
  }

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ py: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <IconButton onClick={() => navigate('/admin')} size="small" sx={{ bgcolor: 'action.hover' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "sans-serif" }}>All Residents</Typography>
            <Typography variant="caption" color="text.secondary">{filtered.length} users</Typography>
          </Box>
        </Box>

        {/* Filters */}
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth placeholder="Search name or email..."
              value={search} onChange={e => setSearch(e.target.value)} size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* User List */}
        {loading ? [1,2,3,4].map(i => <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 2, mb: 1.5 }} />) :
          filtered.length ? filtered.map(u => (
            <Card key={u.id} sx={{ mb: 1.5, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-1px)' } }}
              onClick={() => setSelected(u)}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Avatar sx={{
                  width: 44, height: 44, fontWeight: 800, flexShrink: 0,
                  fontFamily: "'Syne',sans-serif",
                  bgcolor: u.is_active ? 'rgba(45,212,191,0.12)' : 'rgba(248,113,113,0.12)',
                  color: u.is_active ? 'primary.main' : 'error.main',
                }}>{u.full_name[0]}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{u.full_name}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email} · Block {u.block_name} – {u.flat_number}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75, flexWrap: 'wrap' }}>
                    <Chip icon={<DirectionsCarIcon />} label={`${u.car_count} cars`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                    <Chip icon={<PhoneIcon />} label={`${u.mobile_count} phones`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                  </Box>
                </Box>
                <Chip label={u.is_active ? '✓ Active' : '🚫 Blocked'} size="small"
                  color={u.is_active ? 'success' : 'error'} variant="outlined" sx={{ flexShrink: 0 }} />
              </CardContent>
            </Card>
          )) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: 48, mb: 1 }}>👥</Typography>
              <Typography color="text.secondary">No users found</Typography>
            </Box>
          )
        }
      </Container>

      {/* User Detail Modal */}
      <C4DModal open={!!selected} onClose={() => setSelected(null)} title={`👤 ${selected?.full_name || ''}`}>
        {selected && (
          <>
            <List dense disablePadding sx={{ mb: 2 }}>
              <ListItem divider sx={{ px: 0 }}>
                <ListItemText
                  primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</Typography>}
                  secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>{selected.email}</Typography>}
                />
              </ListItem>
              <ListItem divider sx={{ px: 0 }}>
                <ListItemText
                  primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Location</Typography>}
                  secondary={<Typography sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>Block {selected.block_name} – Flat {selected.flat_number}</Typography>}
                />
              </ListItem>
              {selected.mobiles?.length > 0 && (
                <ListItem divider sx={{ px: 0 }}>
                  <ListItemText
                    primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mobiles</Typography>}
                    secondary={selected.mobiles.map(m => <Typography key={m.id} sx={{ fontWeight: 500, fontSize: '0.88rem', color: 'text.primary' }}>{m.number}</Typography>)}
                  />
                </ListItem>
              )}
              {selected.cars?.length > 0 && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={<Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vehicles</Typography>}
                    secondary={selected.cars.map(c => <Typography key={c.id} sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', letterSpacing: '0.08em', fontFamily: 'monospace' }}>{c.plate_number}</Typography>)}
                  />
                </ListItem>
              )}
            </List>

            <Chip label={selected.is_active ? '✓ Active' : '🚫 Suspended'} size="small"
              color={selected.is_active ? 'success' : 'error'} variant="outlined" sx={{ mb: 2 }} />

            <Grid container spacing={1.5}>
              {selected.is_active ? (
                <Grid item xs={6}>
                  <Button fullWidth variant="outlined" color="error" startIcon={actioning ? <CircularProgress size={16} /> : <BlockIcon />}
                    onClick={() => suspend(selected)} disabled={actioning}>
                    Suspend
                  </Button>
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <Button fullWidth variant="outlined" color="success" startIcon={actioning ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                    onClick={() => activate(selected)} disabled={actioning}>
                    Activate
                  </Button>
                </Grid>
              )}
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" color="error" startIcon={actioning ? <CircularProgress size={16} /> : <DeleteIcon />}
                  onClick={() => deleteUser(selected)} disabled={actioning}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </C4DModal>
    </AdminLayout>
  )
}
