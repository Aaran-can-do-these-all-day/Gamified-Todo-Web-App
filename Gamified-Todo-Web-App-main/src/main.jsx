import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import { PomodoroSettingsProvider } from './context/PomodoroSettingsContext.jsx'
import { HabitsProvider } from './stores/habitStore.jsx'
import { QuestsProvider } from './stores/questStore.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PomodoroSettingsProvider>
        <PlayerProvider>
          <HabitsProvider>
            <QuestsProvider>
              <App />
            </QuestsProvider>
          </HabitsProvider>
        </PlayerProvider>
      </PomodoroSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
