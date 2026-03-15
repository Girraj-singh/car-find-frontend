// src/store/authStore.js
import { create } from 'zustand'
import api from '@/api/axios'

const getStored = (key, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

export const useAuthStore = create((set, get) => ({
  user:    getStored('user'),
  access:  localStorage.getItem('access') || '',
  refresh: localStorage.getItem('refresh') || '',

  get isLoggedIn() { return !!(get().access && get().user) },
  get isAdmin()    { return get().user?.role === 'admin' },

  setAuth(data) {
    localStorage.setItem('user',    JSON.stringify(data.user))
    localStorage.setItem('access',  data.access)
    localStorage.setItem('refresh', data.refresh)
    set({ user: data.user, access: data.access, refresh: data.refresh })
  },

  clearAuth() {
    localStorage.removeItem('user')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    set({ user: null, access: '', refresh: '' })
  },

  async logout() {
    try { await api.post('/auth/logout/', { refresh: get().refresh }) } catch {}
    get().clearAuth()
    window.location.href = '/login'
  },

  async fetchProfile() {
    const { data } = await api.get('/users/profile/')
    const merged = { ...get().user, ...data }
    localStorage.setItem('user', JSON.stringify(merged))
    set({ user: merged })
    return data
  },
}))
