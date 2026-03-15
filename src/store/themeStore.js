// src/store/themeStore.js
import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  mode: localStorage.getItem('theme') || 'dark',
  toggleTheme() {
    set(state => {
      const next = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return { mode: next }
    })
  },
}))
