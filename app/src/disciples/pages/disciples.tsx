import React from 'react';
import DisciplesTableComponent from '../components/disciplesTableComponent';
import { DisciplesColumnsTable } from '../components/disciplesColumnsTable';
import { useDiscipleStore } from '@/src/stores';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Disciples: React.FC = () => {
    const discipleState = useDiscipleStore(state => state.Disciples);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Discipulos</h1>
                <Link to="/disciples/create" className={buttonVariants({ variant: "outline" }) + " mr-14"}>
                    <Plus className="mr-2" />Nuevo Discipulo
                </Link>
            </div>
            <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
                <DisciplesTableComponent data={discipleState} columns={DisciplesColumnsTable}></DisciplesTableComponent>
            </div>
        </>
    );
};

export default Disciples;