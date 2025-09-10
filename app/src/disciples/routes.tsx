import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Disciples = React.lazy(() => import('./pages/disciples'));
const DiscipleForm = React.lazy(() => import('./pages/discipleForm'));

const DisciplesRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Disciples />} />
            <Route path="create" element={<DiscipleForm />} />
            <Route path=":id" element={<DiscipleForm />} />
        </Routes>
    );
};

export default DisciplesRoutes;