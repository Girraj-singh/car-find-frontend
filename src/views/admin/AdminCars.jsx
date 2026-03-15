// src/views/admin/AdminCars.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, IconButton, TextField,
  InputAdornment, Chip, Skeleton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Avatar
} from '@mui/material'
import ArrowBackIcon     from '@mui/icons-material/ArrowBack'
import SearchIcon        from '@mui/icons-material/Search'
import DeleteIcon        from '@mui/icons-material/Delete'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import { useSnackbar } from 'notistack'
import AdminLayout from '@/components/AdminLayout'
import api from '@/api/axios'

export default function AdminCars() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [cars,    setCars]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    api.get('/admin/cars/').then(r => { setCars(r.data); setLoading(false) })
  }, [])

  const filtered = useMemo(() =>
    !search ? cars : cars.filter(c => c.plate_number.toLowerCase().includes(search.toLowerCase())),
    [cars, search]
  )

  async function deleteCar(c) {
    if (!confirm(`Remove car ${c.plate_number}?`)) return
    try {
      await api.delete(`/admin/cars/${c.id}/`)
      setCars(prev => prev.filter(x => x.id !== c.id))
      enqueueSnackbar('Car removed', { variant: 'success' })
    } catch { enqueueSnackbar('Failed', { variant: 'error' }) }
  }

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <IconButton onClick={() => navigate('/admin')} size="small" sx={{ bgcolor: 'action.hover' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>All Vehicles 🚗</Typography>
        </Box>

        <TextField
          fullWidth placeholder="Search car number..." value={search}
          onChange={e => setSearch(e.target.value)} size="small" sx={{ mb: 2.5 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />

        {loading ? [1, 2, 3, 4, 5].map(i => <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 1, mb: 1 }} />) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Car Number</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Block / Flat</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <DirectionsCarIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.08em', fontSize: '0.88rem' }}>{c.plate_number}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.owner_name}</Typography>
                      <Typography variant="caption" color="text.disabled">{c.owner_email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{c.owner_block} / {c.owner_flat}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={c.owner_active ? 'Active' : 'Blocked'} size="small"
                        color={c.owner_active ? 'success' : 'error'} variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="error" onClick={() => deleteCar(c)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>No cars found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </AdminLayout>
  )
}
