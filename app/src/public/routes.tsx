import React from "react";
import { Route, Routes } from "react-router-dom";

const RegisterPage = React.lazy(() => import("./pages/Register"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPassword"));
const EventPage = React.lazy(() => import("./pages/EventPage"));
const EventRegisterPage = React.lazy(() => import("./pages/EventRegister"));

export const PublicRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            {/* Public Routes without authentication check */}
            <Route path="eventPage/:id" element={<EventPage />} />
            <Route path="registerInEvent" element={<EventRegisterPage />} />
        </Routes>
    );
};