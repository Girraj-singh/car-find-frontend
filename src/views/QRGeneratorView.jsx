// src/views/QRGeneratorView.jsx
// User apna personal QR card generate + download kar sakta hai
// Canvas pe beautiful card draw hoti hai - name, block, flat, mobile included
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, CircularProgress, Divider,
  List, ListItem, ListItemText, ListItemIcon, Skeleton
} from '@mui/material'
import DownloadIcon      from '@mui/icons-material/Download'
import QrCode2Icon       from '@mui/icons-material/QrCode2'
import RefreshIcon       from '@mui/icons-material/Refresh'
import PersonIcon        from '@mui/icons-material/Person'
import ApartmentIcon     from '@mui/icons-material/Apartment'
import PhoneIcon         from '@mui/icons-material/Phone'
import CheckCircleIcon   from '@mui/icons-material/CheckCircle'
import { useSnackbar } from 'notistack'
import AppLayout from '@/components/AppLayout'
import { useThemeStore } from '@/store/themeStore'
import api from '@/api/axios'

// ── Helpers ───────────────────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

// Builds the JSON string that gets encoded into the QR code
function buildQRPayload(profile) {
  return JSON.stringify({
    name:    profile.full_name   || '',
    block:   profile.block_name  || '',
    flat:    profile.flat_number || '',
    mobiles: (profile.mobiles || []).map(m => m.number),
    app:     'C4D',
  })
}

// Draws the final card onto canvas once QR image is loaded
function drawCard(canvas, qrImg, profile, isDark) {
  const ctx = canvas.getContext('2d')
  const W = 420, H = 580
  canvas.width = W; canvas.height = H

  // ── Colour palette ────────────────────────────────────
  const bg       = isDark ? '#161b22' : '#ffffff'
  const card     = isDark ? '#1c2333' : '#f8fbff'
  const border   = isDark ? '#30363d' : '#c8d6e8'
  const text1    = isDark ? '#e6edf3' : '#0f1923'
  const text2    = isDark ? '#8b949e' : '#4a5568'
  const accent   = '#0d9488'

  // ── Card background ───────────────────────────────────
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  roundRect(ctx, 16, 16, W - 32, H - 32, 20)
  ctx.fillStyle = card
  ctx.fill()
  ctx.strokeStyle = border
  ctx.lineWidth = 1.5
  roundRect(ctx, 16, 16, W - 32, H - 32, 20)
  ctx.stroke()

  // ── Gradient header ───────────────────────────────────
  const grad = ctx.createLinearGradient(16, 16, W - 16, 16)
  grad.addColorStop(0, '#2dd4bf')
  grad.addColorStop(1, '#0ea5e9')
  ctx.fillStyle = grad
  roundRect(ctx, 16, 16, W - 32, 90, 20)
  ctx.fill()
  // Fix bottom corners of header (make them square)
  ctx.fillRect(16, 86, W - 32, 20)

  // ── App logo + title in header ────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath(); ctx.arc(W - 50, 42, 38, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W - 20, 80, 28, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('🚗 C4D', 36, 56)

  ctx.font = '500 13px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText('Society Car Finder – Resident Card', 36, 78)

  // ── QR image (centered) ───────────────────────────────
  const QS = 200
  const QX = (W - QS) / 2
  const QY = 120

  // White bg for QR
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, QX - 12, QY - 12, QS + 24, QS + 24, 14)
  ctx.fill()

  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  roundRect(ctx, QX - 12, QY - 12, QS + 24, QS + 24, 14)
  ctx.stroke()

  ctx.drawImage(qrImg, QX, QY, QS, QS)

  // "Scan to see owner info" label below QR
  ctx.fillStyle = text2
  ctx.font = '500 11.5px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('📷  Scan QR to get owner contact info', W / 2, QY + QS + 26)

  // ── Divider ───────────────────────────────────────────
  ctx.strokeStyle = border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(44, QY + QS + 40); ctx.lineTo(W - 44, QY + QS + 40)
  ctx.stroke()

  // ── User info rows ────────────────────────────────────
  const infoY = QY + QS + 58
  const rowH  = 32

  const rows = [
    { emoji: '👤', label: 'Name',       value: profile.full_name   || '—' },
    { emoji: '🏢', label: 'Block',      value: profile.block_name  || '—' },
    { emoji: '🚪', label: 'Flat',       value: profile.flat_number || '—' },
    ...(profile.mobiles || []).slice(0, 2).map((m, i) => ({
      emoji: '📱',
      label: i === 0 ? 'Mobile' : 'Alt. Mobile',
      value: m.number,
    })),
  ]

  rows.forEach((row, i) => {
    const y = infoY + i * rowH
    // Subtle alternating bg
    if (i % 2 === 0) {
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
      roundRect(ctx, 28, y - 14, W - 56, rowH - 2, 6)
      ctx.fill()
    }
    ctx.font = '500 13px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = text2
    ctx.fillText(`${row.emoji}  ${row.label}`, 40, y + 4)

    ctx.font = '600 13px sans-serif'
    ctx.fillStyle = text1
    ctx.textAlign = 'right'
    ctx.fillText(row.value, W - 40, y + 4)
  })

  // ── Footer ────────────────────────────────────────────
  ctx.fillStyle = text2
  ctx.font = '400 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Generated by C4D · Society Car Management', W / 2, H - 26)
}

// ── Main Component ────────────────────────────────────────────────────────
export default function QRGeneratorView() {
  const { mode } = useThemeStore()
  const { enqueueSnackbar } = useSnackbar()
  const canvasRef = useRef(null)

  const [profile,   setProfile]   = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrReady,   setQrReady]   = useState(false)

  // Fetch profile on mount
  useEffect(() => {
    api.get('/users/profile/')
      .then(r => { setProfile(r.data); setLoading(false) })
      .catch(() => { setLoading(false); enqueueSnackbar('Could not load profile', { variant: 'error' }) })
  }, [])

  // Auto-generate when profile loaded
  useEffect(() => {
    if (profile) generateQR()
  }, [profile])

  // Re-generate if theme changes
  useEffect(() => {
    if (profile && qrReady) generateQR()
  }, [mode])

  const generateQR = useCallback(async () => {
    if (!profile || !canvasRef.current) return
    setQrLoading(true)
    setQrReady(false)

    try {
      const payload  = buildQRPayload(profile)
      const encoded  = encodeURIComponent(payload)
      // qrserver.com — free, no API key, returns PNG
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}&margin=10&color=0d9488&bgcolor=ffffff&ecc=M`

      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        drawCard(canvasRef.current, img, profile, mode === 'dark')
        setQrReady(true)
        setQrLoading(false)
      }

      img.onerror = () => {
        // Draw a "no internet" placeholder card
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        canvas.width = 420; canvas.height = 580
        ctx.fillStyle = mode === 'dark' ? '#1c2333' : '#f0f4f8'
        ctx.fillRect(0, 0, 420, 580)
        ctx.fillStyle = mode === 'dark' ? '#8b949e' : '#4a5568'
        ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('⚠️  Internet required to generate QR', 210, 280)
        ctx.font = '13px sans-serif'
        ctx.fillText('Please connect to the internet and try again', 210, 310)
        setQrReady(true)
        setQrLoading(false)
        enqueueSnackbar('Need internet to generate QR code', { variant: 'warning' })
      }

      img.src = qrApiUrl
    } catch {
      setQrLoading(false)
      enqueueSnackbar('QR generation failed', { variant: 'error' })
    }
  }, [profile, mode])

  const download = () => {
    if (!canvasRef.current || !qrReady) return
    const safeName = (profile?.full_name || 'user').replace(/\s+/g, '_')
    const link = document.createElement('a')
    link.download = `C4D_QR_${safeName}.png`
    link.href = canvasRef.current.toDataURL('image/png', 1.0)
    link.click()
    enqueueSnackbar('QR Card downloaded! 📥', { variant: 'success' })
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <AppLayout>
      <Container maxWidth="sm" sx={{ py: 2.5 }}>
        {/* Page Header */}
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>My QR Code 🪪</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Download your resident card — stick it on your windshield
          </Typography>
        </Box>

        {loading ? (
          <Skeleton variant="rounded" height={440} sx={{ borderRadius: 3, mb: 2 }} />
        ) : (
          <>
            {/* ── Canvas Preview Card ─────────────────────── */}
            <Card sx={{ mb: 2.5, overflow: 'hidden', border: '1.5px solid', borderColor: 'primary.main' }}>
              {/* Canvas area */}
              <Box sx={{
                bgcolor: 'background.default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: 340, p: 2, position: 'relative',
              }}>
                {/* Loading overlay */}
                {qrLoading && (
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 2, bgcolor: 'background.default', zIndex: 2,
                  }}>
                    <CircularProgress color="primary" size={44} thickness={3} />
                    <Typography variant="body2" color="text.secondary">Generating QR card...</Typography>
                  </Box>
                )}

                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%', borderRadius: 12,
                    display: qrReady ? 'block' : 'none',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  }}
                />

                {!qrLoading && !qrReady && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <QrCode2Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.35 }} />
                    <Typography color="text.secondary">Press Generate to create your card</Typography>
                  </Box>
                )}
              </Box>

              {/* Action row */}
              <Box sx={{ p: 2, display: 'flex', gap: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                  variant="outlined" fullWidth
                  startIcon={<RefreshIcon />}
                  onClick={generateQR}
                  disabled={qrLoading}
                  sx={{ borderRadius: 2.5, py: 1.1 }}
                >
                  Regenerate
                </Button>
                <Button
                  variant="contained" fullWidth
                  startIcon={<DownloadIcon />}
                  onClick={download}
                  disabled={!qrReady || qrLoading}
                  sx={{ borderRadius: 2.5, py: 1.1 }}
                >
                  Download PNG
                </Button>
              </Box>
            </Card>

            {/* ── Info embedded in QR ─────────────────────── */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem' }}>
                  ℹ️ Info encoded in QR
                </Typography>

                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="caption" color="text.disabled">Name</Typography>}
                      secondary={<Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{profile?.full_name}</Typography>}
                    />
                  </ListItem>

                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ApartmentIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="caption" color="text.disabled">Block & Flat</Typography>}
                      secondary={
                        <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                          Block {profile?.block_name || '—'}  •  Flat {profile?.flat_number || '—'}
                        </Typography>
                      }
                    />
                  </ListItem>

                  {(profile?.mobiles || []).map((m, i) => (
                    <ListItem key={i} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <PhoneIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="caption" color="text.disabled">{i === 0 ? 'Primary Mobile' : 'Alternate Mobile'}</Typography>}
                        secondary={<Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{m.number}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18, mt: 0.1, flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    This QR card is safe to share with society members. It encodes your name, flat info, and contact numbers so anyone can call you when your car is blocking.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </AppLayout>
  )
}
