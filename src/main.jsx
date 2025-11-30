import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './tailwind.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <h1 className="text-3xl bg-red-300 font-bold underline">Hello, Tailwind CSS!</h1>
  </StrictMode>,
)
