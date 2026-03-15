// src/components/C4DModal.jsx
import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function C4DModal({ open, onClose, title, children, maxWidth = 'sm' }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, m: 2 } }}
    >
      <DialogTitle sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid', borderColor: 'divider', pb: 2, fontFamily: "'Syne',sans-serif", fontWeight: 700,
      }}>
        <Typography variant="h6" sx={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{title}</Typography>
        <IconButton onClick={onClose} size="small" sx={{
          bgcolor: 'action.hover', '&:hover': { bgcolor: 'error.main', color: '#fff' }
        }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>{children}</DialogContent>
    </Dialog>
  )
}
