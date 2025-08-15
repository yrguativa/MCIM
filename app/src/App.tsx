import React from 'react';
import { BrowserRouter,  } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";

import './App.css'
import { GeneralRoutes } from './routes';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>        
        <GeneralRoutes/>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App;
