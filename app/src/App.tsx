import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css'
import { GeneralRoutes } from './routes';
import { LanguageSwitcher } from './components/LanguageSwitcher';


const App: React.FC = () => {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>        
        <GeneralRoutes/>
        <LanguageSwitcher />
      </BrowserRouter>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App;
