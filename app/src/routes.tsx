import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { useAuthStore } from "./app/stores/auth/auth.store";

import DashboardPage from "./dashboard/pages/Dashboard";
import { LoginPage } from "./public/pages/Login";
import RegisterPage from "./public/pages/Register";
import ForgotPasswordPage from "./public/pages/ForgotPassword";
import { PublicRoutes } from "./public/routes";


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
};

export const GeneralRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/public/*" element={<PublicRoutes />} />

            {/* Protected Routes */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};