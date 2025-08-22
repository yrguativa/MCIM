import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import DashboardPage from "./dashboard/pages/Dashboard";
import { EventRegisterPage } from "./public/pages/EventRegister";
import { LoginPage } from "./public/pages/Login";
import { RegisterPage } from "./public/pages/Register";
import { ForgotPasswordPage } from "./public/pages/ForgotPassword";
import { useAuthStore } from "./stores/auth/auth.store";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const GeneralRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Protected Routes */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* Public Routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            {/* Public Routes without authentication check */}
            <Route path="registerInEvent/:id" element={<EventRegisterPage />} />
        </Routes>
    );
};