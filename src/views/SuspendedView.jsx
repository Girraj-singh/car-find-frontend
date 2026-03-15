// src/views/SuspendedView.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Container } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'

export default function SuspendedView() {
  const navigate = useNavigate()
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth="xs" sx={{ textAlign: 'center' }}>
        <BlockIcon sx={{ fontSize: 72, color: 'error.main', mb: 2, opacity: 0.7 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: "'Syne',sans-serif" }}>Account Suspended</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Your account has been suspended by the society admin. Please contact the admin for assistance.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/login')}>← Back to Login</Button>
      </Container>
    </Box>
  )
}
