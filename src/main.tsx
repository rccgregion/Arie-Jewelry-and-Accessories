import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure any stale service worker caches from dev mode don't block image assets
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'production') {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
