import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App';

import './index.scss';

const enableMocking = async () => {
  if (import.meta.env.MODE !== 'development' || !import.meta.env.VITE_MSW_ENABLED) {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    serviceWorker: {},
  });
};

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
