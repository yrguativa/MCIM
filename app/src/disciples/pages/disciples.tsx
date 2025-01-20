import React, { useEffect } from 'react';
import DisciplesTableComponent from '../components/disciplesTableComponent';
import { DisciplesColumnsTable } from '../components/disciplesColumnsTable';
import { useDiscipleStore } from '@/src/stores';

const Disciples: React.FC = () => {
    const discipleState = useDiscipleStore(state => state.Disciples);
    const getDisciplesState = useDiscipleStore(state => state.getDisciples);

    useEffect(() => {
        getDisciplesState();
    }, []);

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Discipulos</h1>
            </div>
            <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
                <DisciplesTableComponent data={discipleState} columns={DisciplesColumnsTable}></DisciplesTableComponent>
            </div>
        </>
    );
};

export default Disciples;