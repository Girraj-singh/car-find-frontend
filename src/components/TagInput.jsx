// src/components/TagInput.jsx
import React, { useState } from 'react'
import { Box, Chip, InputBase, Typography, FormHelperText } from '@mui/material'

export default function TagInput({ tags, onChange, placeholder, maxTags = 5, error, helperText, uppercase = false }) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const val = uppercase ? input.trim().toUpperCase() : input.trim()
    if (!val || tags.includes(val) || tags.length >= maxTags) return
    onChange([...tags, val])
    setInput('')
  }

  const removeTag = (i) => onChange(tags.filter((_, idx) => idx !== i))

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    if (e.key === 'Backspace' && !input && tags.length > 0) removeTag(tags.length - 1)
  }

  return (
    <Box>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 0.75, p: 1.25,
        border: '1.5px solid', borderColor: error ? 'error.main' : 'divider',
        borderRadius: 2.5, minHeight: 50,
        bgcolor: 'background.default',
        transition: 'all 0.2s',
        '&:focus-within': {
          borderColor: error ? 'error.main' : 'primary.main',
          boxShadow: t => `0 0 0 3px ${t.palette.mode === 'dark' ? 'rgba(45,212,191,0.12)' : 'rgba(13,148,136,0.1)'}`,
        },
      }}>
        {tags.map((tag, i) => (
          <Chip
            key={i} label={tag} size="small"
            onDelete={() => removeTag(i)}
            sx={{
              bgcolor: t => t.palette.mode === 'dark' ? 'rgba(45,212,191,0.12)' : 'rgba(13,148,136,0.1)',
              color: 'primary.main',
              border: '1px solid', borderColor: 'primary.main',
              fontWeight: 600, fontSize: '0.78rem',
            }}
          />
        ))}
        {tags.length < maxTags && (
          <InputBase
            value={input}
            onChange={e => setInput(uppercase ? e.target.value.toUpperCase() : e.target.value)}
            onKeyDown={handleKey}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : ''}
            sx={{ flex: 1, minWidth: 140, fontSize: '0.88rem', pl: 0.5, color: 'text.primary' }}
          />
        )}
      </Box>
      <FormHelperText error={error} sx={{ mx: 1.5 }}>
        {error ? helperText : `Press Enter to add · ${tags.length}/${maxTags}`}
      </FormHelperText>
    </Box>
  )
}
