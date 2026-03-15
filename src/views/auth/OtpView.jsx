// src/views/auth/OtpView.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, LinearProgress, CircularProgress, Link } from '@mui/material'
import { useSnackbar } from 'notistack'
import AuthLayout from '@/components/AuthLayout'
import api from '@/api/axios'

export default function OtpView() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const email   = sessionStorage.getItem('reg_email') || ''
  const refs    = useRef([])
  const [digits, setDigits]   = useState(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState(600)
  const [resendIn,  setResendIn]  = useState(30)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!email) navigate('/register')
    refs.current[0]?.focus()
    const id = setInterval(() => {
      setRemaining(r => (r > 0 ? r - 1 : 0))
      setResendIn(r => { if (r > 0) return r - 1; setCanResend(true); return 0 })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const otp = digits.join('')

  const onInput = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]; next[i] = v; setDigits(next)
    if (v && i < 5) refs.current[i + 1]?.focus()
  }

  const onKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const onPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    setDigits(prev => { const n = [...prev]; text.split('').forEach((c, i) => { n[i] = c }); return n })
    refs.current[Math.min(text.length, 5)]?.focus()
    e.preventDefault()
  }

  const verify = async () => {
    if (otp.length < 6) return
    setLoading(true)
    try {
      await api.post('/auth/verify-otp/', { email, otp_code: otp })
      enqueueSnackbar('Email verified! ✅', { variant: 'success' })
      navigate('/register/profile')
    } catch (e) {
      enqueueSnackbar(e.response?.data?.non_field_errors?.[0] || 'Invalid OTP', { variant: 'error' })
      setDigits(Array(6).fill(''))
      refs.current[0]?.focus()
    } finally { setLoading(false) }
  }

  const resend = async () => {
    try {
      await api.post('/auth/resend-otp/', { email })
      setRemaining(600); setResendIn(30); setCanResend(false)
      enqueueSnackbar('New OTP sent!', { variant: 'success' })
    } catch { enqueueSnackbar('Failed to resend OTP', { variant: 'error' }) }
  }

  const m = Math.floor(remaining / 60), s = remaining % 60

  return (
    <AuthLayout title="Verify OTP" subtitle={`OTP sent to ${email}`} icon="🔐" step={2}>
      {/* 6 OTP boxes */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 3 }} onPaste={onPaste}>
        {digits.map((d, i) => (
          <Box
            key={i}
            component="input"
            ref={el => refs.current[i] = el}
            value={d}
            onChange={e => onInput(i, e.target.value)}
            onKeyDown={e => onKeyDown(e, i)}
            maxLength={1}
            inputMode="numeric"
            sx={{
              width: { xs: 40, sm: 48 }, height: { xs: 52, sm: 60 },
              textAlign: 'center', fontSize: { xs: '1.3rem', sm: '1.6rem' },
              fontWeight: 800, fontFamily: "'Syne',sans-serif",
              borderRadius: 2.5, border: '2px solid',
              borderColor: d ? 'primary.main' : 'divider',
              bgcolor: d ? t => t.palette.mode === 'dark' ? 'rgba(45,212,191,0.1)' : 'rgba(13,148,136,0.07)' : 'background.default',
              color: 'text.primary',
              outline: 'none',
              transition: 'all 0.15s',
              '&:focus': { borderColor: 'primary.main', boxShadow: t => `0 0 0 3px ${t.palette.mode==='dark'?'rgba(45,212,191,0.15)':'rgba(13,148,136,0.12)'}` },
            }}
          />
        ))}
      </Box>

      {/* Timer */}
      <Box sx={{ mb: 2.5 }}>
        <LinearProgress
          variant="determinate" value={(remaining / 600) * 100}
          sx={{ borderRadius: 1, height: 4, bgcolor: 'divider', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
        />
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Expires in {m}:{s.toString().padStart(2, '0')}
        </Typography>
      </Box>

      <Button
        variant="contained" fullWidth size="large"
        onClick={verify} disabled={loading || otp.length < 6}
        sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 2 }}
      >
        {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Verify OTP →'}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Didn't receive?{' '}
        <Box
          component="span"
          onClick={canResend ? resend : undefined}
          sx={{ color: 'primary.main', fontWeight: 700, cursor: canResend ? 'pointer' : 'default', opacity: canResend ? 1 : 0.5 }}
        >
          {canResend ? 'Resend OTP' : `Resend in ${resendIn}s`}
        </Box>
      </Typography>
    </AuthLayout>
  )
}
