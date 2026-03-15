// src/api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('access')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

let isRefreshing = false
let queue = []

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then(token => { original.headers.Authorization = `Bearer ${token}`; return api(original) })
      }
      isRefreshing = true
      const refresh = localStorage.getItem('refresh')
      if (!refresh) { isRefreshing = false; window.dispatchEvent(new Event('auth:logout')); return Promise.reject(err) }
      try {
        const { data } = await axios.post('/api/auth/refresh/', { refresh })
        localStorage.setItem('access', data.access)
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`
        queue.forEach(p => p.resolve(data.access))
        queue = []
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch (e) {
        queue.forEach(p => p.reject(e))
        queue = []
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(e)
      } finally { isRefreshing = false }
    }
    return Promise.reject(err)
  }
)

export default api
