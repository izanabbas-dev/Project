import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { CartContextProvider } from './contexts/CartContext.jsx'
import { ThemeContextProvider } from './contexts/ThemeContext.jsx'
import { BrowserRouter } from "react-router-dom"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeContextProvider>
      <AuthContextProvider>
        <CartContextProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </CartContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </BrowserRouter>
)
