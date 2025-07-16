import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CreateEvent } from '../pages/CreateEvent';
import { ScanQR } from '../pages/ScanQR';

export const EventRoutes = () => {
  return (
    <Routes>
      <Route path="/events/create" element={<CreateEvent />} />
      <Route path="/events/scan" element={<ScanQR />} />
    </Routes>
  );
};
