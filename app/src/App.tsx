import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css'
import { Progress } from "@/components/ui/progress"
import { GeneralRoutes } from './routes';
import { LanguageSwitcher } from './app/components/LanguageSwitcher';


const App: React.FC = () => {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Suspense fallback={<Progress value={null} />}>
          <GeneralRoutes />
        </Suspense>
        <LanguageSwitcher />
      </BrowserRouter>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App;
