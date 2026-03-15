// src/views/auth/RegisterView.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import { useSnackbar } from 'notistack'
import AuthLayout from '@/components/AuthLayout'
import api from '@/api/axios'

export default function RegisterView() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError('')
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return }
    setLoading(true)
    try {
      await api.post('/auth/send-otp/', { email })
      sessionStorage.setItem('reg_email', email)
      enqueueSnackbar('OTP sent to your email! 📧', { variant: 'success' })
      navigate('/register/otp')
    } catch (e) {
      setError(e.response?.data?.email?.[0] || e.response?.data?.detail || 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Enter your email to get started" icon="📧" step={1}>
      <TextField
        label="Email Address" type="email" fullWidth
        value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        error={!!error} helperText={error}
        InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }}
        sx={{ mb: 3 }}
        placeholder="you@example.com"
      />
      <Button
        variant="contained" fullWidth size="large"
        onClick={submit} disabled={loading}
        sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5 }}
      >
        {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Send OTP →'}
      </Button>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2.5 }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: 'inherit', fontWeight: 700 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>Sign In</Box>
        </Link>
      </Typography>
    </AuthLayout>
  )
}
