import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import store from './store/store.js'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: {
              background: 'var(--color-base-200)',
              color: 'var(--color-base-content)',
              border: '1px solid var(--color-base-300)',
            },
          }} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
