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
      <Route path="admin/cycles" element={<AdminDashboard />} />
      <Route path="admin/levels" element={<AdminDashboard />} />
      <Route path="admin/classrooms" element={<AdminDashboard />} />
      <Route path="admin/schedules" element={<AdminDashboard />} />
      <Route path="admin/courses" element={<AdminDashboard />} />
      <Route path="enrollment/teacher" element={<AdminDashboard />} />
      <Route path="enrollment/student" element={<AdminDashboard />} />
      <Route path="teacher/my-courses" element={<TeacherDashboard />} />
      <Route path="teacher/attendance" element={<ScanAttendance />} />
      <Route path="teacher/attendance/:courseId" element={<ScanAttendance />} />
      <Route path="teacher/qr" element={<TeacherDashboard />} />
      <Route path="student/progress" element={<StudentProgress />} />
      <Route path="student/my-courses" element={<StudentProgress />} />
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
