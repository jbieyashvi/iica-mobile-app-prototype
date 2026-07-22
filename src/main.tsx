import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './state/AuthContext'
import { PortfolioProvider } from './state/PortfolioContext'
import { EventsProvider } from './state/EventsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <PortfolioProvider>
          <EventsProvider>
            <App />
          </EventsProvider>
        </PortfolioProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
