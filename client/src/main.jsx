import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './components/css/style.css'
import './tailwind.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
