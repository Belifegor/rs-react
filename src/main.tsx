import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.tsx';

function ensureRoot(): HTMLElement {
  const el = document.getElementById('root');
  if (!el) {
    throw new Error("Missing <div id='root'></div> in index.html");
  }
  return el;
}

const rootEl = ensureRoot();

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
