import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { AlertProvider } from './context/AlertContext'
import reportWebVitals from './reportWebVitals'

// Version-check + cache-bust helper:
// Fetches `/version.json` (served from `public/`) and compares to a stored
// `appVersion` in localStorage. If a stored version exists and differs from
// the fetched version, the page reloads once to force the client to fetch new
// assets. This helps update clients that have cached bundles or service
// worker content.
const init = async () => {
  try {
    const resp = await fetch('/version.json', { cache: 'no-store' })
    if (resp.ok) {
      const { version } = await resp.json()
      const stored = localStorage.getItem('appVersion')

      if (stored && stored !== version) {
        // A different version is deployed — update stored value and reload
        localStorage.setItem('appVersion', version)
        // Force a single reload to pick up new assets
        window.location.reload()
        return
      }

      if (!stored) {
        // First run for this client: record the version so future deploys
        // can detect a change.
        localStorage.setItem('appVersion', version)
      }
    }
  } catch (e) {
    // Fail open: if version check fails, just continue to render the app.
    // eslint-disable-next-line no-console
    console.warn('Version check failed', e)
  }

  ReactDOM.render(
    <React.StrictMode>
      <AlertProvider>
        <App />
      </AlertProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )

  // Performance metrics
  reportWebVitals()
}

void init()
