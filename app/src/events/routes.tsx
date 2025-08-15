import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WeeklyCalendar } from './pages/WeeklyCalendar';
import { CreateEvent } from './pages/CreateEvent';
import { ScanQR } from './pages/ScanQR';

export const EventsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WeeklyCalendar />} />
      <Route path="create" element={<CreateEvent />} />
      <Route path="scan" element={<ScanQR />} />

    </Routes>
  );
};