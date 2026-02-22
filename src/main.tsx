import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Debug helper to catch runtime errors on Vercel
window.onerror = (message, source, lineno, colno, error) => {
  const errorMsg = `Runtime Error: ${message}\nAt: ${source}:${lineno}:${colno}`;
  console.error(errorMsg, error);

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
            <div style="background: #1c1c1e; color: #ff3b30; padding: 20px; font-family: system-ui; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <h1 style="margin-bottom: 10px;">DayFold Error</h1>
                <p style="color: #fff; margin-bottom: 20px; opacity: 0.8;">Something went wrong during initialization.</p>
                <code style="background: #000; padding: 15px; border-radius: 8px; font-size: 13px; text-align: left; max-width: 90%; overflow: auto; color: #ff3b30;">${errorMsg}</code>
                <button onclick="window.location.reload()" style="margin-top: 20px; background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">Reload App</button>
            </div>
        `;
  }
  return false;
};

// Clear any orphaned Service Workers that might be caching old assets
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(success => {
        if (success) console.log('Successfully unregistered Service Worker');
      });
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
