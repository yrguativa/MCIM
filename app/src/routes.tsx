import React from "react";
import { Route, Routes } from "react-router-dom";

import DashboardPage from "./dashboard/pages/Dashboard";
import { EventRegisterPage } from "./public/EventRegister";
import { LoginPage } from "./public/Login";

export const GeneralRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/*" element={<DashboardPage />} />
            <Route path="registerInEvent/:id" element={<EventRegisterPage />} />
            <Route path="login" element={<LoginPage />} />
        </Routes>
    );
};