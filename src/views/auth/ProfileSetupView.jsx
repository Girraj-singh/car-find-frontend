// src/views/auth/ProfileSetupView.jsx - Block & Flat as TEXT FIELDS
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, TextField, Button,
  Paper, CircularProgress, InputAdornment, IconButton,
  AppBar, Toolbar
} from '@mui/material'
import PersonIcon        from '@mui/icons-material/Person'
import ApartmentIcon     from '@mui/icons-material/Apartment'
import MeetingRoomIcon   from '@mui/icons-material/MeetingRoom'
import LockIcon          from '@mui/icons-material/Lock'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowBackIcon     from '@mui/icons-material/ArrowBack'
import DarkModeIcon      from '@mui/icons-material/DarkMode'
import LightModeIcon     from '@mui/icons-material/LightMode'
import { useSnackbar } from 'notistack'
import TagInput from '@/components/TagInput'
import { useAuthStore }  from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import api from '@/api/axios'

export default function ProfileSetupView() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { setAuth } = useAuthStore()
  const { mode, toggleTheme } = useThemeStore()

  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    full_name:   '',
    block_name:  '',
    flat_number: '',
    password:    '',
  })
  const [mobiles,    setMobiles]    = useState([])
  const [carNumbers, setCarNumbers] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!sessionStorage.getItem('reg_email')) navigate('/register')
  }, [])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim())   e.full_name   = 'Name is required'
    if (!form.block_name.trim())  e.block_name  = 'Block name is required (e.g. A, B, Tower-1)'
    if (!form.flat_number.trim()) e.flat_number = 'Flat number is required (e.g. 101, B-204)'
    if (form.password.length < 8) e.password    = 'Password must be at least 8 characters'
    if (mobiles.length === 0)     e.mobiles     = 'At least one mobile number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const email = sessionStorage.getItem('reg_email')
      const { data } = await api.post('/auth/register/', {
        ...form,
        email,
        mobiles,
        car_numbers: carNumbers,
      })
      setAuth(data)
      sessionStorage.removeItem('reg_email')
      enqueueSnackbar('Welcome to C4D! 🎉', { variant: 'success' })
      navigate('/dashboard')
    } catch (e) {
      const d = e.response?.data
      if (d) {
        const mapped = {}
        Object.keys(d).forEach(k => { mapped[k] = Array.isArray(d[k]) ? d[k][0] : d[k] })
        setErrors(mapped)
      }
      enqueueSnackbar('Registration failed. Check the form.', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navbar */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2, minHeight: '56px !important' }}>
          <IconButton onClick={() => navigate(-1)} size="small" sx={{ color: 'text.primary' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg,#2dd4bf,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🚗</Box>
            <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>
              C4D<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
            </Typography>
          </Box>
          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 3, pb: 6 }}>
        {/* Step dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mb: 3 }}>
          {[1, 2, 3].map(i => (
            <Box key={i} sx={{
              height: 8, borderRadius: 4,
              width: i === 3 ? 24 : 8,
              bgcolor: i < 3 ? 'success.main' : 'primary.main',
              transition: 'all 0.3s',
            }} />
          ))}
        </Box>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px', mx: 'auto', mb: 1.5,
            background: 'linear-gradient(135deg,#2dd4bf,#0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', boxShadow: '0 0 20px rgba(45,212,191,0.3)',
          }}>🏠</Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Complete Profile</Typography>
          <Typography variant="body2" color="text.secondary">Tell us about you and your vehicles</Typography>
        </Box>

        {/* ── Personal Info ─────────────────────────────────── */}
        <Paper sx={{ p: 2.5, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
            👤 Personal Info
          </Typography>

          <TextField
            label="Full Name" fullWidth required
            value={form.full_name} onChange={e => set('full_name', e.target.value)}
            error={!!errors.full_name} helperText={errors.full_name}
            placeholder="Rahul Kumar"
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Society Block" fullWidth required
            value={form.block_name} onChange={e => set('block_name', e.target.value)}
            error={!!errors.block_name} helperText={errors.block_name || 'e.g. A, B, Tower-1, East Wing'}
            placeholder="A"
            InputProps={{ startAdornment: <InputAdornment position="start"><ApartmentIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Flat Number" fullWidth required
            value={form.flat_number} onChange={e => set('flat_number', e.target.value)}
            error={!!errors.flat_number} helperText={errors.flat_number || 'e.g. 101, A-204, Ground Floor'}
            placeholder="101"
            InputProps={{ startAdornment: <InputAdornment position="start"><MeetingRoomIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password" type={showPass ? 'text' : 'password'} fullWidth required
            value={form.password} onChange={e => set('password', e.target.value)}
            error={!!errors.password} helperText={errors.password}
            placeholder="Min 8 characters"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} size="small" edge="end">
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* ── Mobile Numbers ────────────────────────────────── */}
        <Paper sx={{ p: 2.5, mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
            📱 Mobile Numbers *
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1.5 }}>
            Add up to 3 numbers — press Enter after each
          </Typography>
          <TagInput
            tags={mobiles} onChange={setMobiles}
            placeholder="+91 98765 43210 → Enter"
            maxTags={3}
            error={!!errors.mobiles}
            helperText={errors.mobiles}
          />
        </Paper>

        {/* ── Car Numbers ───────────────────────────────────── */}
        <Paper sx={{ p: 2.5, mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
            🚗 Car Numbers (optional)
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1.5 }}>
            Add up to 5 car registration numbers
          </Typography>
          <TagInput
            tags={carNumbers} onChange={setCarNumbers}
            placeholder="MH 12 AB 3456 → Enter"
            maxTags={5}
            uppercase
          />
        </Paper>

        <Button
          variant="contained" fullWidth size="large"
          onClick={submit} disabled={loading}
          sx={{ py: 1.75, fontSize: '1.05rem', borderRadius: 2.5 }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : '🎉 Create Account'}
        </Button>
      </Container>
    </Box>
  )
}
