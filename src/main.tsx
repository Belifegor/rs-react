import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../src/assets/styles/index.css';
import MasterDetailWrapper from './components/MasterDetailWrapper.tsx';
import Layout from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import About from './pages/AboutPage.tsx';
import NotFound from './pages/NotFound.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<MasterDetailWrapper />}>
                <Route index element={<></>} />
                <Route path=":page" element={<></>} />
                <Route path=":page/:detailsId" element={<></>} />
              </Route>
              <Route path="about" element={<About />} />
              <Route path="not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </StrictMode>
  );
}
