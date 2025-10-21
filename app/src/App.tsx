import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Toaster } from "@/components/ui/sonner";
import { ProgressIndeterminate } from '@/components/ui/progress-indeterminate';
import { LanguageSwitcher } from './app/components/LanguageSwitcher';

import { GeneralRoutes } from './routes';

import './App.css'

const App: React.FC = () => {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HashRouter>
        <Suspense fallback={<ProgressIndeterminate />}>
          <GeneralRoutes />
        </Suspense>
        <LanguageSwitcher />
      </HashRouter>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App;
