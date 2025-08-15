import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import { CellsRoutes } from "../cells/routes";
import { DisciplesRoutes } from "../disciples/routes";
import { EventsRoutes } from "../events/routes";
import { MinistryRoutes } from "../ministries/routes";

export const DashboardRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="cells/*" element={<CellsRoutes />} />
            <Route path="disciples/*" element={<DisciplesRoutes />} />
            <Route path="events/*" element={<EventsRoutes />} />
            <Route path="ministries/*" element={<MinistryRoutes />} />
        </Routes>
    );
};