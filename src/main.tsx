import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.tsx';
import { ensureRoot } from './ensureRoot';

const rootEl = ensureRoot();

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
