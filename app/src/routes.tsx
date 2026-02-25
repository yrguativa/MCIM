import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { useAuthStore } from "./app/stores/auth/auth.store";

import DashboardPage from "./dashboard/pages/Dashboard";
import { LoginPage } from "./public/pages/Login";
import { PublicRoutes } from "./public/routes";


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

import RegisterPage from "./public/pages/Register";

export const GeneralRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes - deben estar primero */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="public/*" element={<PublicRoutes />} />

            {/* Protected Routes - deben estar al final */}
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