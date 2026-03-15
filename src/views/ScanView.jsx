// src/views/ScanView.jsx
import React, { useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent,
  TextField, Button, Avatar, CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PhoneIcon  from '@mui/icons-material/Phone'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { useSnackbar } from 'notistack'
import AppLayout from '@/components/AppLayout'
import api from '@/api/axios'

export default function ScanView() {
  const { enqueueSnackbar } = useSnackbar()
  const [qrInput,  setQrInput]  = useState('')
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [searched, setSearched] = useState(false)

  const searchByQR = async () => {
    if (!qrInput) return
    setLoading(true); setSearched(false)
    try {
      const { data } = await api.get(`/cars/search-qr/?q=${encodeURIComponent(qrInput)}`)
      setResults(data.results || [])
      setSearched(true)
    } catch { enqueueSnackbar('Search failed', { variant: 'error' }) }
    finally { setLoading(false) }
  }

  return (
    <AppLayout>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>📷 QR Code Scan</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Point camera at the QR sticker on the car</Typography>
        </Box>

        {/* QR Scanner box */}
        <Box sx={{
          width: 260, height: 260, mx: 'auto', mb: 3, borderRadius: 3,
          border: '3px solid', borderColor: 'primary.main',
          bgcolor: 'background.paper', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Scan line animation */}
          <Box sx={{
            position: 'absolute', left: 0, right: 0, height: '3px',
            bgcolor: 'primary.main', boxShadow: '0 0 8px #2dd4bf',
            animation: 'scan 2s linear infinite',
            '@keyframes scan': { '0%': { top: 0 }, '100%': { top: '100%' } },
            top: 0,
          }} />
          {/* Corners */}
          {[
            { top: 10, left: 10, borderWidth: '3px 0 0 3px' },
            { top: 10, right: 10, borderWidth: '3px 3px 0 0' },
            { bottom: 10, left: 10, borderWidth: '0 0 3px 3px' },
            { bottom: 10, right: 10, borderWidth: '0 3px 3px 0' },
          ].map((style, i) => (
            <Box key={i} sx={{ position: 'absolute', width: 22, height: 22, borderColor: 'primary.main', borderStyle: 'solid', ...style }} />
          ))}
          <QrCodeScannerIcon sx={{ fontSize: 56, color: 'text.disabled', opacity: 0.3, mb: 1 }} />
          <Typography variant="caption" color="text.disabled" sx={{ px: 3, textAlign: 'center' }}>Camera permission required in production</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>or enter QR code manually</Typography>

        <TextField
          fullWidth label="QR Code Value" value={qrInput}
          onChange={e => setQrInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchByQR()}
          placeholder="Enter QR code value" sx={{ mb: 2 }}
          inputProps={{ style: { textAlign: 'center' } }}
        />
        <Button variant="contained" fullWidth size="large" onClick={searchByQR}
          disabled={!qrInput || loading} startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SearchIcon />}
          sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 3 }}>
          {loading ? 'Searching...' : 'Search by QR'}
        </Button>

        {searched && (
          results.length > 0 ? results.map((r, idx) => (
            <Card key={idx} sx={{ mb: 2.5, border: '1px solid', borderColor: 'primary.main', overflow: 'hidden' }}>
              <Box sx={{ background: 'linear-gradient(135deg,#2dd4bf,#0ea5e9)', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,.2)', border: '2px solid rgba(255,255,255,.4)', fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>{r.owner_name[0]}</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#fff', fontFamily: "sans-serif" }}>{r.owner_name}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,.85)', fontSize: '0.8rem' }}>Block {r.owner_block} • Flat {r.owner_flat}</Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {r.owner_mobiles.map((mob, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: i < r.owner_mobiles.length - 1 ? 1.5 : 0 }}>
                    <Typography sx={{ fontWeight: 600 }}>{mob}</Typography>
                    <Button variant="outlined" size="small" startIcon={<PhoneIcon />} href={`tel:${mob}`} component="a" color="success" sx={{ borderRadius: 2 }}>Call</Button>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>❓ Not Recognized</Typography>
              <Typography variant="body2" color="text.secondary">QR code not found in the system</Typography>
            </Box>
          )
        )}
      </Container>
    </AppLayout>
  )
}
