import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ScanAttendance } from './pages/ScanAttendance';
import { StudentProgress } from './pages/StudentProgress';
import { ProgressManagement } from './pages/ProgressManagement';
import { FormationDashboard } from './pages/FormationDashboard';

export const FormationSchoolRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<FormationDashboard />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="teacher" element={<TeacherDashboard />} />
      <Route path="attendance" element={<ScanAttendance />} />
      <Route path="attendance/:courseId" element={<ScanAttendance />} />
      <Route path="progress" element={<StudentProgress />} />
      <Route path="progress/manage" element={<ProgressManagement />} />
      <Route path="progress/manage/:courseId" element={<ProgressManagement />} />
      <Route path="/" element={<FormationDashboard />} />
    </Routes>
  );
};
