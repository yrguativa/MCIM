import React from 'react';
import { Routes, Route } from 'react-router-dom';

const Ministries = React.lazy(() => import('./pages/Ministries'));
const CreateMinistry = React.lazy(() => import('./pages/CreateMinistry'));

const MinistryRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Ministries />} />
            <Route path="create" element={<CreateMinistry />} />
            <Route path=":id" element={<CreateMinistry />} />
        </Routes>
    );
};

export default MinistryRoutes;