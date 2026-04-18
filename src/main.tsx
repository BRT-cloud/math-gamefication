import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('error', (e) => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.innerHTML = `<div style="color: red; padding: 20px; background: white; z-index: 99999; position: relative; word-break: break-all;">Error: ${e.message}<br/>${e.filename}:${e.lineno}</div>`;
  }
});

window.addEventListener('unhandledrejection', (e) => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    splash.innerHTML = `<div style="color: red; padding: 20px; background: white; z-index: 99999; position: relative; word-break: break-all;">Promise Error: ${e.reason}</div>`;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
