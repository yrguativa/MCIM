import React from "react";
import { Route, Routes } from "react-router-dom";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const CellsRoutes = React.lazy(() => import("../cells/routes"));
const DisciplesRoutes = React.lazy(() => import("../disciples/routes"));
const EventsRoutes = React.lazy(() => import("../events/routes"));
const MinistryRoutes = React.lazy(() => import("../ministries/routes"));
const FormationSchoolRoutes = React.lazy(() => import("../formation-school/routes").then(m => ({ default: m.FormationSchoolRoutes })));

export const DashboardRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="cells/*" element={<CellsRoutes />} />
            <Route path="disciples/*" element={<DisciplesRoutes />} />
            <Route path="events/*" element={<EventsRoutes />} />
            <Route path="ministries/*" element={<MinistryRoutes />} />
            <Route path="formation-school/*" element={<FormationSchoolRoutes />} />
        </Routes>
    );
};