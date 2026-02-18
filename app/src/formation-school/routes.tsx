import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ScanAttendance } from './pages/ScanAttendance';
import { StudentProgress } from './pages/StudentProgress';
import { ProgressManagement } from './pages/ProgressManagement';

export const FormationSchoolRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="teacher" element={<TeacherDashboard />} />
      <Route path="attendance" element={<ScanAttendance />} />
      <Route path="attendance/:classId" element={<ScanAttendance />} />
      <Route path="progress" element={<StudentProgress />} />
      <Route path="progress/manage" element={<ProgressManagement />} />
      <Route path="progress/manage/:courseClassId" element={<ProgressManagement />} />
      <Route path="/" element={<AdminDashboard />} />
    </Routes>
  );
};
