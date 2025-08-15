'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '../utils/ThemeProvider';
import './index.css';
import './globals.css';

import App from '../App';
import MasterDetailWrapper from '../components/MasterDetailWrapper';

const queryClient = new QueryClient();

export default function ClientOnly() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App>
          <MasterDetailWrapper />
        </App>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
