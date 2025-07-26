import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import '../src/assets/styles/index.css';
import Details from './components/Details.tsx';
import Layout from './Layout.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path=":page/:detailsId" element={<Details />} />
              <Route path=":page" element={null} />
              <Route index element={null} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>
  );
}
