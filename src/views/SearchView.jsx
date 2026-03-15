// src/views/SearchView.jsx
// Tab 1: Search by Car Number
// Tab 2: QR Scan with real camera (html5-qrcode) + result popup
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box, Container, Typography, Card, CardContent,
  Button, Chip, CircularProgress, Avatar, Tab, Tabs,
  Dialog, DialogContent, DialogTitle, IconButton,
  Divider, List, ListItem, ListItemText, Slide
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PhoneIcon from '@mui/icons-material/Phone'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import CloseIcon from '@mui/icons-material/Close'
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn'
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff'
import CameraswitchIcon from '@mui/icons-material/Cameraswitch'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useSnackbar } from 'notistack'
import AppLayout from '@/components/AppLayout'
import api from '@/api/axios'

// ── Slide-up transition for popup ─────────────────────────
const SlideUp = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />)

// ── Result Popup Dialog ────────────────────────────────────────────────────
function ResultPopup({ open, onClose, results, scannedRaw }) {
  const found = results && results.length > 0

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          // position: 'fixed',
          //  bottom: 0, 
          //  left: 0, 
          //  right: 0,
          // m: 0,
          //  maxHeight: '85vh',
        }
      }}
    >
      {/* Drag handle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5 }}>
        <Box sx={{ width: 40, height: 4, bgcolor: 'divider', borderRadius: 99 }} />
      </Box>

      <DialogTitle sx={{ pb: 1, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: found ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
          }}>
            {found
              ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 22 }} />
              : <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 22 }} />
            }
          </Box>
          <Typography sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.05rem' }}>
            {found ? `${results.length} Owner${results.length > 1 ? 's' : ''} Found` : 'QR Not Recognised'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'action.hover' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 3 }}>
        {found ? (
          results.map((r, idx) => (
            <Box key={idx}>
              {idx > 0 && <Divider sx={{ my: 2 }} />}

              {/* Owner header */}
              <Box sx={{
                background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
                borderRadius: 3, p: 2, mb: 2,
                display: 'flex', alignItems: 'center', gap: 2,
              }}>
                <Avatar sx={{
                  width: 52, height: 52, fontWeight: 800,
                  fontFamily: "'Syne',sans-serif", fontSize: '1.3rem',
                  bgcolor: 'rgba(255,255,255,0.22)',
                  border: '2.5px solid rgba(255,255,255,0.45)',
                }}>
                  {r.owner_name?.[0] || '?'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#fff', fontFamily: "'Syne',sans-serif", fontSize: '1.05rem' }}>
                    {r.owner_name}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>
                    Block {r.owner_block}  •  Flat {r.owner_flat}
                  </Typography>
                  {r.plate_number && (
                    <Chip
                      label={r.plate_number}
                      size="small"
                      icon={<DirectionsCarIcon style={{ color: '#fff', fontSize: 13 }} />}
                      sx={{ mt: 0.75, bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.06em', height: 22 }}
                    />
                  )}
                </Box>
              </Box>

              {/* Mobile numbers */}
              <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, pl: 0.5 }}>
                Contact Numbers
              </Typography>
              {r.owner_mobiles?.length > 0 ? r.owner_mobiles.map((mob, i) => (
                <Box key={i} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  mt: 1.25, p: 1.5,
                  bgcolor: 'action.hover', borderRadius: 2.5,
                  border: '1px solid', borderColor: 'divider',
                }}>
                  <Box>
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                      {i === 0 ? '📞 Primary' : '📞 Alternate'}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.03em', color: 'text.primary' }}>
                      {mob}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<PhoneIcon />}
                    href={`tel:${mob}`}
                    component="a"
                    sx={{ borderRadius: 2.5, fontWeight: 700, px: 2.5, boxShadow: 'none' }}
                  >
                    Call
                  </Button>
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No contact number available</Typography>
              )}
            </Box>
          ))
        ) : (
          /* Not found state */
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: '50%', mx: 'auto', mb: 2,
              bgcolor: 'rgba(248,113,113,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <QrCode2Icon sx={{ fontSize: 36, color: 'error.main', opacity: 0.7 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>QR Not Recognised</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
              This QR code is not registered in the C4D system.
              Make sure the car owner has registered on C4D.
            </Typography>
            {scannedRaw && (
              <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1.5, mb: 2 }}>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scanned data</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', fontSize: '0.78rem' }}>
                  {scannedRaw.length > 120 ? scannedRaw.slice(0, 120) + '...' : scannedRaw}
                </Typography>
              </Box>
            )}
            <Button variant="outlined" fullWidth onClick={onClose} sx={{ borderRadius: 2.5 }}>
              Scan Again
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Shared Result Cards (for car number search) ───────────────────────────
function ResultCards({ results }) {
  return (
    <>
      {results.map((r, idx) => (
        <Card key={idx} sx={{ mb: 2.5, border: '1.5px solid', borderColor: 'primary.main', overflow: 'hidden' }}>
          <Box sx={{ background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40, fontWeight: 700, fontFamily: "'Syne',sans-serif", bgcolor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)' }}>
              {r.owner_name?.[0] || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, color: '#fff', fontFamily: "'Syne',sans-serif", fontSize: '1rem' }}>{r.owner_name}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>Block {r.owner_block} • Flat {r.owner_flat}</Typography>
            </Box>
            <Chip label={r.plate_number} icon={<DirectionsCarIcon style={{ color: '#fff', fontSize: 14 }} />} size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'monospace' }} />
          </Box>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {r.owner_mobiles?.length > 0 ? r.owner_mobiles.map((mob, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25, borderBottom: i < r.owner_mobiles.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>{i === 0 ? 'Primary' : 'Alternate'} Mobile</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.92rem' }}>{mob}</Typography>
                </Box>
                <Button variant="outlined" size="small" color="success" startIcon={<PhoneIcon />} href={`tel:${mob}`} component="a" sx={{ borderRadius: 2, fontWeight: 700 }}>Call</Button>
              </Box>
            )) : <Typography variant="body2" color="text.secondary">No contact number available</Typography>}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

// ── Tab 1: Search by Car Number ───────────────────────────────────────────
function SearchByCarNumber() {
  const { enqueueSnackbar } = useSnackbar()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = async () => {
    if (query.length < 2) return
    setLoading(true); setSearched(false)
    try {
      const { data } = await api.get(`/cars/search/?q=${query}&type=digit`)
      setResults(data.results || [])
      setSearched(true)
      if (!data.found) enqueueSnackbar('No car found with those digits', { variant: 'info' })
    } catch { enqueueSnackbar('Search failed. Please try again.', { variant: 'error' }) }
    finally { setLoading(false) }
  }

  return (
    <Box>
      <Card sx={{
        mb: 2, p: 2.5,
        border: '2px solid',
        borderColor: query.length > 0 ? 'primary.main' : 'divider',
        boxShadow: query.length > 0 ? t => `0 0 0 4px ${t.palette.mode === 'dark' ? 'rgba(45,212,191,0.1)' : 'rgba(13,148,136,0.08)'}` : 'none',
        transition: 'all 0.2s',
      }}>
        <Box
          component="input"
          value={query}
          onChange={e => setQuery(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
          maxLength={4}
          placeholder="1234"
          inputMode="numeric"
          sx={{
            display: 'block', width: '100%', background: 'transparent', border: 'none', outline: 'none',
            textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.3em',
            fontFamily: "sans-serif", color: 'text.primary',
            '&::placeholder': { color: 'text.disabled', fontSize: '1.5rem', letterSpacing: '0.2em' },
          }}
        />
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 1, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Last 4 digits of number plate
        </Typography>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2.5 }}>
        {[0, 1, 2, 3].map(i => (
          <Box key={i} sx={{ width: 40, height: 5, borderRadius: 99, bgcolor: i < query.length ? 'primary.main' : 'divider', transition: 'background-color 0.2s' }} />
        ))}
      </Box>

      <Button
        variant="contained" fullWidth size="large"
        onClick={doSearch} disabled={query.length < 2 || loading}
        startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SearchIcon />}
        sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2.5, mb: 3 }}
      >
        {loading ? 'Searching...' : 'Find Car Owner'}
      </Button>

      {searched && (
        results.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip label={`${results.length} car${results.length > 1 ? 's' : ''} found`} size="small" color="success" />
              <Typography variant="caption" color="text.disabled">for digits "{query}"</Typography>
            </Box>
            <ResultCards results={results} />
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ fontSize: 56, mb: 1.5 }}>🔍</Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>No Car Found</Typography>
            <Typography variant="body2" color="text.secondary">No vehicle with plate ending in <strong>"{query}"</strong></Typography>
          </Box>
        )
      )}
    </Box>
  )
}

// ── QR Scanner using html5-qrcode ─────────────────────────────────────────
// function QRScannerBox({ onScanSuccess, onScanError, active }) {
//   const containerRef = useRef(null)
//   const scannerRef = useRef(null)
//   const [torch, setTorch] = useState(false)
//   const [facingMode, setFacingMode] = useState('environment') // back camera first
//   const [camError, setCamError] = useState('')
//   const [starting, setStarting] = useState(false)

//   const startScanner = useCallback(async () => {
//     if (!containerRef.current || !active) return
//     setStarting(true)
//     setCamError('')

//     try {
//       // Dynamically import to avoid SSR issues
//       const { Html5Qrcode } = await import('html5-qrcode')

//       // Stop existing scanner if any
//       if (scannerRef.current) {
//         try { await scannerRef.current.stop() } catch { }
//         scannerRef.current = null
//       }

//       const scanner = new Html5Qrcode('qr-reader-container')
//       scannerRef.current = scanner

//       await scanner.start(
//         { facingMode },
//         {
//           fps: 10,
//           qrbox: { width: 220, height: 220 },
//           aspectRatio: 1.0,
//           showTorchButtonIfSupported: false,
//           showZoomSliderIfSupported: false,
//           defaultZoomValueIfSupported: 1,
//           formatsToSupport: [0], // QR_CODE only
//         },
//         (decodedText) => {
//           // Success - auto-stop scanner then notify parent
//           scanner.stop().catch(() => { })
//           onScanSuccess(decodedText)
//         },
//         () => { } // scan failure - suppress noisy logs
//       )
//     } catch (err) {
//       const msg = err?.message || ''
//       if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
//         setCamError('Camera permission denied. Please allow camera access in your browser settings.')
//       } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('no camera')) {
//         setCamError('No camera found on this device.')
//       } else {
//         setCamError('Could not start camera. ' + (msg || 'Try refreshing.'))
//       }
//     } finally {
//       setStarting(false)
//     }
//   }, [facingMode, active, onScanSuccess])

//   // Start when active, stop when not
//   useEffect(() => {
//     if (active) {
//       startScanner()
//     } else {
//       if (scannerRef.current) {
//         scannerRef.current.stop().catch(() => { })
//         scannerRef.current = null
//       }
//     }
//     return () => {
//       if (scannerRef.current) {
//         scannerRef.current.stop().catch(() => { })
//         scannerRef.current = null
//       }
//     }
//   }, [active, facingMode])

//   const toggleTorch = async () => {
//     if (!scannerRef.current) return
//     try {
//       const newState = !torch
//       await scannerRef.current.applyVideoConstraints({ advanced: [{ torch: newState }] })
//       setTorch(newState)
//     } catch { /* torch not supported */ }
//   }

//   const switchCamera = () => {
//     setFacingMode(f => f === 'environment' ? 'user' : 'environment')
//   }

//   return (
//     <Box sx={{ position: 'relative' }}>
//       {/* Camera container — html5-qrcode renders video here */}
//       <Box
//         id="qr-reader-container"
//         ref={containerRef}
//         sx={{
//           width: '100%',
//           borderRadius: 3,
//           overflow: 'hidden',
//           border: '2.5px solid',
//           borderColor: 'primary.main',
//           bgcolor: '#000',
//           minHeight: 280,
//           position: 'relative',
//           // Override html5-qrcode default styles
//           '& video': { width: '100% !important', objectFit: 'cover' },
//           '& img': { display: 'none' },
//           '& #qr-shaded-region': { borderColor: 'transparent !important' },
//         }}
//       />

//       {/* Loading overlay */}
//       {starting && (
//         <Box sx={{
//           position: 'absolute', inset: 0, borderRadius: 3,
//           bgcolor: 'rgba(0,0,0,0.75)',
//           display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
//         }}>
//           <CircularProgress sx={{ color: '#2dd4bf' }} size={44} thickness={3} />
//           <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>Starting camera...</Typography>
//         </Box>
//       )}

//       {/* Error overlay */}
//       {camError && (
//         <Box sx={{
//           position: 'absolute', inset: 0, borderRadius: 3,
//           bgcolor: 'rgba(13,17,23,0.95)',
//           display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//           gap: 2, p: 3, textAlign: 'center',
//         }}>
//           <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.8 }} />
//           <Typography sx={{ color: '#e6edf3', fontSize: '0.9rem', lineHeight: 1.6 }}>{camError}</Typography>
//           <Button variant="outlined" size="small" onClick={startScanner} sx={{ borderRadius: 2, color: '#2dd4bf', borderColor: '#2dd4bf' }}>
//             Try Again
//           </Button>
//         </Box>
//       )}

//       {/* Camera controls - top right */}
//       {!camError && !starting && (
//         <Box sx={{
//           position: 'absolute', top: 10, right: 10,
//           display: 'flex', flexDirection: 'column', gap: 1,
//         }}>
//           <IconButton
//             onClick={toggleTorch} size="small"
//             sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: torch ? '#fbbf24' : '#fff', backdropFilter: 'blur(6px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
//           >
//             {torch ? <FlashlightOnIcon fontSize="small" /> : <FlashlightOffIcon fontSize="small" />}
//           </IconButton>
//           <IconButton
//             onClick={switchCamera} size="small"
//             sx={{ bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
//           >
//             <CameraswitchIcon fontSize="small" />
//           </IconButton>
//         </Box>
//       )}

//       {/* Scan hint label - bottom */}
//       {!camError && !starting && (
//         <Box sx={{
//           position: 'absolute', bottom: 0, left: 0, right: 0,
//           background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
//           borderRadius: '0 0 12px 12px',
//           py: 1.5, textAlign: 'center',
//         }}>
//           <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
//             📷 Point camera at C4D QR code
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   )
// }
function QRScannerBox({ onScanSuccess, active }) {
  const containerRef = useRef(null)
  const scannerRef = useRef(null)

  const [torch, setTorch] = useState(false)
  const [facingMode, setFacingMode] = useState("environment")
  const [starting, setStarting] = useState(false)
  const [camError, setCamError] = useState("")

  const safeStopScanner = async () => {
    const scanner = scannerRef.current
    if (!scanner) return

    try {
      const state = scanner.getState?.()

      if (state === 2 || state === 3) {
        await scanner.stop()
      }
    } catch (err) {
      console.warn("Scanner stop skipped:", err.message)
    }

    scannerRef.current = null
  }

  const startScanner = useCallback(async () => {
    if (!containerRef.current || !active) return

    setStarting(true)
    setCamError("")

    try {
      const { Html5Qrcode } = await import("html5-qrcode")

      await safeStopScanner()

      const scanner = new Html5Qrcode("qr-reader-container")
      scannerRef.current = scanner

      await scanner.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: false
        },
        async (decodedText) => {
          await safeStopScanner()
          onScanSuccess(decodedText)
        },
        () => {}
      )
    } catch (err) {
      const msg = err?.message || ""

      if (msg.toLowerCase().includes("permission")) {
        setCamError("Camera permission denied.")
      } else if (msg.toLowerCase().includes("notfound")) {
        setCamError("No camera found on this device.")
      } else {
        setCamError("Could not start camera.")
      }
    } finally {
      setStarting(false)
    }
  }, [active, facingMode, onScanSuccess])

  useEffect(() => {
    if (active) {
      startScanner()
    } else {
      safeStopScanner()
    }

    return () => {
      safeStopScanner()
    }
  }, [active, facingMode])

  const toggleTorch = async () => {
    const scanner = scannerRef.current
    if (!scanner) return

    try {
      const newState = !torch
      await scanner.applyVideoConstraints({
        advanced: [{ torch: newState }]
      })
      setTorch(newState)
    } catch {}
  }

  const switchCamera = () => {
    setFacingMode((prev) =>
      prev === "environment" ? "user" : "environment"
    )
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        id="qr-reader-container"
        ref={containerRef}
        sx={{
          width: "100%",
          minHeight: 280,
          bgcolor: "#000",
          borderRadius: 3,
          overflow: "hidden",
          border: "2px solid",
          borderColor: "primary.main",
          "& video": {
            width: "100% !important",
            objectFit: "cover"
          }
        }}
      />

      {starting && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CircularProgress sx={{ color: "#2dd4bf" }} />
        </Box>
      )}

      {camError && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            textAlign: "center"
          }}
        >
          <Typography color="error">{camError}</Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={startScanner}
          >
            Try Again
          </Button>
        </Box>
      )}

      {!starting && !camError && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            flexDirection: "column",
            gap: 1
          }}
        >
          <IconButton
            onClick={toggleTorch}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.6)", color: "#fff" }}
          >
            {torch ? <FlashlightOnIcon /> : <FlashlightOffIcon />}
          </IconButton>

          <IconButton
            onClick={switchCamera}
            size="small"
            sx={{ bgcolor: "rgba(0,0,0,0.6)", color: "#fff" }}
          >
            <CameraswitchIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

// ── Tab 2: Search by QR Scan ──────────────────────────────────────────────
// function SearchByQR({ active }) {
//   const { enqueueSnackbar } = useSnackbar()
//   const [scanning,    setScanning]    = useState(false)
//   const [searching,   setSearching]   = useState(false)
//   const [scannedRaw,  setScannedRaw]  = useState('')
//   const [results,     setResults]     = useState([])
//   const [popupOpen,   setPopupOpen]   = useState(false)

//   // Start scanner when tab becomes active
//   useEffect(() => {
//     if (active) setScanning(true)
//     else        setScanning(false)
//   }, [active])

//   const handleScanned = useCallback(async (rawText) => {
//     setScanning(false)
//     setScannedRaw(rawText)
//     setSearching(true)

//     console.log('qr code data' , encodeURIComponent(rawText))

//     try {
//       const { data } = await api.get(`/cars/search-qr/?q=${encodeURIComponent(rawText)}`)
//       setResults(data.results || [])
//     } catch {
//       setResults([])
//       enqueueSnackbar('Search failed. Try scanning again.', { variant: 'error' })
//     } finally {
//       setSearching(false)
//       setPopupOpen(true)
//     }
//   }, [])

//   const handlePopupClose = () => {
//     setPopupOpen(false)
//     setScannedRaw('')
//     setResults([])
//     // Re-start scanner after popup closes
//     setTimeout(() => setScanning(true), 400)
//   }

//   return (
//     <Box>
//       {/* Scanner */}
//       <QRScannerBox
//         onScanSuccess={handleScanned}
//         active={scanning && active && !popupOpen}
//       />

//       {/* Searching overlay over scanner */}
//       {searching && (
//         <Box sx={{
//           mt: 2, p: 2.5, borderRadius: 3,
//           bgcolor: 'background.paper',
//           border: '1px solid', borderColor: 'primary.main',
//           display: 'flex', alignItems: 'center', gap: 2,
//         }}>
//           <CircularProgress size={28} color="primary" />
//           <Box>
//             <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>QR Detected! Searching...</Typography>
//             <Typography variant="caption" color="text.disabled">Looking up owner info</Typography>
//           </Box>
//         </Box>
//       )}

//       {/* Info chips below scanner */}
//       {!searching && (
//         <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
//           <Chip icon={<QrCode2Icon sx={{ fontSize: 14 }} />} label="Scan C4D QR sticker" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
//           <Chip icon={<CameraswitchIcon sx={{ fontSize: 14 }} />} label="Tap icon to switch camera" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
//           <Chip icon={<FlashlightOnIcon sx={{ fontSize: 14 }} />} label="Tap for torch" size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
//         </Box>
//       )}

//       {/* Result popup */}
//       <ResultPopup
//         open={popupOpen}
//         onClose={handlePopupClose}
//         results={results}
//         scannedRaw={scannedRaw}
//       />
//     </Box>
//   )
// }
function SearchByQR({ active }) {
  const { enqueueSnackbar } = useSnackbar()

  const [scanning, setScanning] = useState(false)
  const [scannedRaw, setScannedRaw] = useState('')
  const [results, setResults] = useState([])
  const [popupOpen, setPopupOpen] = useState(false)

  // Start scanner when tab active
  useEffect(() => {
    if (active) setScanning(true)
    else setScanning(false)
  }, [active])

  const handleScanned = useCallback((rawText) => {
    setScanning(false)
    setScannedRaw(rawText)

    console.log('scane value ', rawText)

    try {
      // Parse QR JSON
      const parsed = JSON.parse(rawText)

      const formatted = [
        {
          owner_name: parsed.name || '',
          owner_block: parsed.block || '',
          owner_flat: parsed.flat || '',
          plate_number: parsed.plate || '',
          owner_mobiles: parsed.mobiles || [],
        },
      ]

      setResults(formatted)
    } catch (err) {
      console.error('Invalid QR format', err)

      enqueueSnackbar('Invalid QR Code format', { variant: 'error' })

      setResults([])
    }

    setPopupOpen(true)
  }, [])

  const handlePopupClose = () => {
    setPopupOpen(false)
    setScannedRaw('')
    setResults([])

    // restart scanner
    setTimeout(() => setScanning(true), 400)
  }

  return (
    <Box>
      {/* QR Scanner */}
      <QRScannerBox
        onScanSuccess={handleScanned}
        active={scanning && active && !popupOpen}
      />

      {/* Info chips */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          mt: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Chip
          icon={<QrCode2Icon sx={{ fontSize: 14 }} />}
          label="Scan C4D QR sticker"
          size="small"
          variant="outlined"
        />

        <Chip
          icon={<CameraswitchIcon sx={{ fontSize: 14 }} />}
          label="Tap icon to switch camera"
          size="small"
          variant="outlined"
        />

        <Chip
          icon={<FlashlightOnIcon sx={{ fontSize: 14 }} />}
          label="Tap for torch"
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Result Popup */}
      <ResultPopup
        open={popupOpen}
        onClose={handlePopupClose}
        results={results}
        scannedRaw={scannedRaw}
      />
    </Box>
  )
}

// ── Main SearchView ───────────────────────────────────────────────────────
export default function SearchView() {
  const [tab, setTab] = useState(0)

  return (
    <AppLayout>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Find a Car 🔍</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Search by plate number or scan the QR code
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2.5, mb: 3, overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ minHeight: 50, '& .MuiTab-root': { minHeight: 50, fontWeight: 700, fontSize: '0.88rem' } }}
          >
            <Tab icon={<DirectionsCarIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="By Car Number" />
            <Tab icon={<QrCodeScannerIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="By QR Scan" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
          <SearchByCarNumber />
        </Box>
        <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
          <SearchByQR active={tab === 1} />
        </Box>
      </Container>
    </AppLayout>
  )
}
