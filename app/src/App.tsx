import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Toaster } from "@/components/ui/sonner";
import { ProgressIndeterminate } from '@/components/ui/progress-indeterminate';
import { LanguageSwitcher } from './app/components/LanguageSwitcher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { GeneralRoutes } from './routes';

import './App.css'

const queryClient = new QueryClient()

const App: React.FC = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <HashRouter>
          <Suspense fallback={<ProgressIndeterminate />}>
            <GeneralRoutes />
          </Suspense>
          <LanguageSwitcher />
        </HashRouter>
        <Toaster />
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App;
