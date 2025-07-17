import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CreateMinistry } from './pages/CreateMinistry';
import { Ministries } from './pages/Ministries';

export const MinistryRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Ministries />} />
            <Route path="create" element={<CreateMinistry />} />
            <Route path=":id" element={<CreateMinistry />} />
        </Routes>
    );
};
