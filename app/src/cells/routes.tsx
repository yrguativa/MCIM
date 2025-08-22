import React from "react";
import { Route, Routes } from "react-router-dom";
import Cells from "./pages/cells";
import CellForm from "./pages/cellForm";
import CellRegister from "./pages/cellRegister";

export const CellsRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Cells />} />
            <Route path=":id" element={<CellForm />} />
            <Route path=":id/register" element={<CellRegister />} />
        </Routes>
    );
};