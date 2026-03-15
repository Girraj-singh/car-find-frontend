// src/views/admin/AdminLogs.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, IconButton, Chip, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AdminLayout from '@/components/AdminLayout'
import api from '@/api/axios'

export default function AdminLogs() {
  const navigate = useNavigate()
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/logs/').then(r => { setLogs(r.data); setLoading(false) })
  }, [])

  const fmt = t => new Date(t).toLocaleString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <IconButton onClick={() => navigate('/admin')} size="small" sx={{ bgcolor: 'action.hover' }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "sans-serif" }}>Search Audit Logs 📋</Typography>
        </Box>

        {loading ? [1,2,3,4,5,6].map(i => <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 1, mb: 1 }} />) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Searched By</TableCell>
                  <TableCell>Query</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map(l => (
                  <TableRow key={l.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="caption" color="text.disabled">{fmt(l.searched_at)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{l.searched_by_name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: '0.9rem' }}>{l.query_text}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={l.search_type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.result_found ? 'Found' : 'Not Found'} size="small"
                        color={l.result_found ? 'success' : 'error'} variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>No logs yet</TableCell>
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
