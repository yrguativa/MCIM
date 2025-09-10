import React from "react";
import { Route, Routes } from "react-router-dom";

const Cells = React.lazy(() => import("./pages/cells"));
const CellForm = React.lazy(() => import("./pages/cellForm"));
const CellRegister = React.lazy(() => import("./pages/cellRegister"));

const CellsRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Cells />} />
            <Route path=":id" element={<CellForm />} />
            <Route path=":id/register" element={<CellRegister />} />
        </Routes>
    );
};

export default CellsRoutes;