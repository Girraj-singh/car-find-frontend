// src/theme/index.js
import { createTheme } from '@mui/material/styles'

const commonTypography = {
  fontFamily: "'DM Sans', sans-serif",
  h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  h2: { fontFamily: "'Syne', sans-serif", fontWeight: 800 },
  h3: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  h4: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
  h5: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
  h6: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
  button: { fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: 'none' },
}

const commonShape = { borderRadius: 12 }

const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        textTransform: 'none',
        fontSize: '0.9rem',
        padding: '10px 20px',
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      },
      containedPrimary: {
        background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
        '&:hover': {
          background: 'linear-gradient(135deg, #14b8a6, #0284c7)',
          transform: 'translateY(-1px)',
          boxShadow: '0 6px 20px rgba(45,212,191,0.4)',
        },
        transition: 'all 0.2s ease',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 14, boxShadow: 'none' },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
          fontFamily: "'DM Sans', sans-serif",
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: { borderRadius: 10 },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8, fontWeight: 600 },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: { height: 64 },
    },
  },
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#2dd4bf', light: '#5eead4', dark: '#0d9488', contrastText: '#fff' },
    secondary: { main: '#0ea5e9', contrastText: '#fff' },
    error:     { main: '#f87171' },
    warning:   { main: '#fbbf24' },
    success:   { main: '#4ade80' },
    background: { default: '#0d1117', paper: '#1c2333' },
    text: { primary: '#e6edf3', secondary: '#8b949e', disabled: '#6e7681' },
    divider: '#30363d',
    action: { hover: 'rgba(45,212,191,0.08)', selected: 'rgba(45,212,191,0.12)' },
  },
  typography: commonTypography,
  shape: commonShape,
  components: {
    ...commonComponents,
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(13,17,23,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #30363d',
          boxShadow: 'none',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'rgba(13,17,23,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #30363d',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#6e7681',
          '&.Mui-selected': { color: '#2dd4bf' },
          minWidth: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1c2333',
          border: '1px solid #30363d',
          borderRadius: 14,
          boxShadow: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#30363d' } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: '#0d1117',
          '& fieldset': { borderColor: '#30363d' },
          '&:hover fieldset': { borderColor: '#8b949e' },
          '&.Mui-focused fieldset': { borderColor: '#2dd4bf' },
        },
        input: { color: '#e6edf3' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: '#8b949e', '&.Mui-focused': { color: '#2dd4bf' } },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#8b949e' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { '&:hover': { background: 'rgba(45,212,191,0.08)' } },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-root': { background: '#161b22', color: '#8b949e', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' } },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: '#21262d' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { background: '#161b22' } },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { background: '#1c2333', border: '1px solid #30363d', borderRadius: 18 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          '&.Mui-selected': { color: '#2dd4bf' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { background: '#2dd4bf' },
      },
    },
  },
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#0d9488', light: '#2dd4bf', dark: '#0f766e', contrastText: '#fff' },
    secondary: { main: '#0284c7', contrastText: '#fff' },
    error:     { main: '#ef4444' },
    warning:   { main: '#d97706' },
    success:   { main: '#16a34a' },
    background: { default: '#f0f4f8', paper: '#ffffff' },
    text: { primary: '#0f1923', secondary: '#4a5568', disabled: '#8a9ab5' },
    divider: '#c8d6e8',
    action: { hover: 'rgba(13,148,136,0.06)', selected: 'rgba(13,148,136,0.1)' },
  },
  typography: commonTypography,
  shape: commonShape,
  components: {
    ...commonComponents,
    MuiButton: {
      ...commonComponents.MuiButton,
      styleOverrides: {
        ...commonComponents.MuiButton.styleOverrides,
        containedPrimary: {
          background: 'linear-gradient(135deg, #0d9488, #0284c7)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f766e, #0369a1)',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(13,148,136,0.35)',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(240,244,248,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #c8d6e8',
          boxShadow: 'none',
          color: '#0f1923',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: 'rgba(240,244,248,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #c8d6e8',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#8a9ab5',
          '&.Mui-selected': { color: '#0d9488' },
          minWidth: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid #c8d6e8',
          borderRadius: 14,
          boxShadow: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: '#f8fbff',
          '& fieldset': { borderColor: '#c8d6e8' },
          '&:hover fieldset': { borderColor: '#4a5568' },
          '&.Mui-focused fieldset': { borderColor: '#0d9488' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: '#4a5568', '&.Mui-focused': { color: '#0d9488' } },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { background: '#ffffff', border: '1px solid #c8d6e8', borderRadius: 18 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          '&.Mui-selected': { color: '#0d9488' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { background: '#0d9488' },
      },
    },
  },
})
