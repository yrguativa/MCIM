import React from 'react';
import { Link } from 'react-router-dom';

import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { DisciplesColumnsTable } from '../components/disciplesColumnsTable';

import TableComponent from '@/src/app/components/TableComponent';
import { useDiscipleStore } from '../store/disciple.store';

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
                <TableComponent data={discipleState} columns={DisciplesColumnsTable}></TableComponent>
            </div>
        </>
    );
};

export default Disciples;