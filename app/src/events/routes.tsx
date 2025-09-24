import React from 'react';
import { Routes, Route } from 'react-router-dom';

const WeeklyCalendar = React.lazy(() => import('./pages/WeeklyCalendar'));
const CreateEvent = React.lazy(() => import('./pages/CreateEvent'));
const ScanQR = React.lazy(() => import('./pages/ScanQR'));

const EventsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WeeklyCalendar />} />
      <Route path="create" element={<CreateEvent />} />
      <Route path="scan" element={<ScanQR />} />
    </Routes>
  );
};

export default EventsRoutes;