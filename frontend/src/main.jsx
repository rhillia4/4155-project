import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import { ThemeContextProvider } from './context/ThemeContext.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
    </ThemeContextProvider>
  </StrictMode>,
)
