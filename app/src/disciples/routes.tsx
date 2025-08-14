import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import DiscipleForm from './pages/discipleForm';
import Disciples from './pages/disciples';

export const DisciplesRoutes: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Disciples />} />
            <Route path="create" element={<DiscipleForm />} />
            <Route path=":id" element={<DiscipleForm />} />
        </Routes>
    );
};
