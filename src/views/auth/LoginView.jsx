// src/views/auth/LoginView.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TextField, Button, Typography, Box, Divider,
  CircularProgress, InputAdornment, IconButton
} from '@mui/material'
import EmailIcon         from '@mui/icons-material/Email'
import LockIcon          from '@mui/icons-material/Lock'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useSnackbar } from 'notistack'
import AuthLayout from '@/components/AuthLayout'
import { useAuthStore } from '@/store/authStore'
import api from '@/api/axios'

export default function LoginView() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { setAuth } = useAuthStore()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const login = async () => {
    setError('')
    if (!email || !password) { setError('Email and password required'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login/', { email, password })
      setAuth(data)
      enqueueSnackbar(`Welcome back, ${data.user.name}! 👋`, { variant: 'success' })
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (e) {
      setError(e.response?.data?.non_field_errors?.[0] || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  const demoLogin = (role) => {
    setEmail(role === 'admin' ? 'admin@c4d.com' : 'rahul.sharma@c4d.com')
    setPassword(role === 'admin' ? 'admin@123' : 'resident@123')
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your C4D account" icon="🔑">
      <TextField
        label="Email Address" type="email" fullWidth
        value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && login()}
        InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
        placeholder="you@example.com" sx={{ mb: 2.5 }}
      />
      <TextField
        label="Password" type={showPass ? 'text' : 'password'} fullWidth
        value={password} onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && login()}
        error={!!error} helperText={error}
        InputProps={{
          startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
          endAdornment: <InputAdornment position="end">
            <IconButton onClick={() => setShowPass(!showPass)} size="small" edge="end">
              {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }}
        placeholder="Enter password" sx={{ mb: 3 }}
      />
      <Button variant="contained" fullWidth size="large" onClick={login} disabled={loading}
        sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 2 }}>
        {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In →'}
      </Button>
      <Divider sx={{ my: 1.5 }}><Typography variant="caption" color="text.disabled">Demo Accounts</Typography></Divider>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
        <Button variant="outlined" size="small" fullWidth onClick={() => demoLogin('admin')} sx={{ borderRadius: 2 }}>🛡 Admin Demo</Button>
        <Button variant="outlined" size="small" fullWidth onClick={() => demoLogin('user')} sx={{ borderRadius: 2 }}>👤 User Demo</Button>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        New resident?{' '}
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/register')}>
          Create Account
        </Box>
      </Typography>
    </AuthLayout>
  )
}
