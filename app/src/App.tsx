import React from 'react';

import './App.css'
import Dashboard from './dashboard/dashboard';
import { Toaster } from "@/components/ui/sonner";

const App: React.FC = () => {
  return (
    <>
      <Dashboard></Dashboard>
      <Toaster />
    </>
  )
}

export default App;
