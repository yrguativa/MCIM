import React from 'react';
import DisciplesTableComponent from '../components/disciplesTableComponent';
import { DisciplesColummsTable } from '../components/disciplesColumnsTable';

const Disciples: React.FC = () => {

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Discipulos</h1>
            </div>
            <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
                <DisciplesTableComponent data={[]} columns={DisciplesColummsTable}></DisciplesTableComponent>
            </div>
        </>
    );
};

export default Disciples;