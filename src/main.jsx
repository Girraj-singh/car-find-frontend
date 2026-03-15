// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <>
    <App />
  </>

  // </React.StrictMode>
)

window.addEventListener('auth:logout', () => {
  localStorage.clear()
  window.location.href = '/login'
})
