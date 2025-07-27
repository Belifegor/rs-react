import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../src/assets/styles/index.css';
import Details from './components/Details.tsx';
import Layout from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import About from './pages/AboutPage.tsx';
import NotFound from './pages/NotFound.tsx';
import CharacterPage from './pages/CharacterPage.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<CharacterPage />} />
              <Route path=":page" element={<CharacterPage />} />
              <Route
                path=":page/:detailsId"
                element={
                  <div className="flex w-full min-h-screen">
                    <div className="w-2/3">
                      <CharacterPage />
                    </div>
                    <div className="w-1/3 border-l bg-gray-700">
                      <Details />
                    </div>
                  </div>
                }
              />
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
