import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css'
import { GeneralRoutes } from './routes';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>        
        <GeneralRoutes/>
      </BrowserRouter>
      <Toaster />
    </GoogleOAuthProvider>
  )
}

export default App;
