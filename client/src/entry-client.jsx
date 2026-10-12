import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/montserrat';
import './styles/index.css';
import App from './App.jsx';

// The app owns scroll position (components/layout/ScrollManager): the browser never restores it, so a
// reload always starts at the top. Set before the app starts, so it applies to this page load.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
