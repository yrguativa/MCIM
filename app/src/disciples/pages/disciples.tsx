import React from 'react';
import { Link } from 'react-router-dom';

import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { DisciplesColumnsTable } from '../components/disciplesColumnsTable';

import TableComponent from '@/src/app/components/TableComponent';
import { useDiscipleStore } from '../store/disciple.store';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { useEffect, useState } from 'react';

const Disciples: React.FC = () => {
    const discipleState = useDiscipleStore(state => state.Disciples);
    const { ministries, getMinistries } = useMinistryStore(state => state);

    const [filterName, setFilterName] = useState("");
    const [filterIdentification, setFilterIdentification] = useState("");
    const [filterMinistry, setFilterMinistry] = useState("all");

    useEffect(() => {
        getMinistries();
    }, [getMinistries]);

    const filteredDisciples = discipleState.filter(disciple => {
        const matchesName = (disciple.name + " " + disciple.lastName).toLowerCase().includes(filterName.toLowerCase());
        const matchesIdentification = disciple.identification.includes(filterIdentification);
        const matchesMinistry = filterMinistry === "all" || disciple.ministryId === filterMinistry;

        return matchesName && matchesIdentification && matchesMinistry;
    });

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold md:text-2xl">Discipulos</h1>
                <Link to="/disciples/create" className={buttonVariants({ variant: "outline" }) + " mr-14"}>
                    <Plus className="mr-2" />Nuevo Discipulo
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                    placeholder="Filtrar por nombre..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
                <Input
                    placeholder="Filtrar por identificación..."
                    value={filterIdentification}
                    onChange={(e) => setFilterIdentification(e.target.value)}
                />
                <Select value={filterMinistry} onValueChange={setFilterMinistry}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por ministerio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los ministerios</SelectItem>
                        {ministries.map(ministry => (
                            <SelectItem key={ministry.id} value={ministry.id}>
                                {ministry.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
                <TableComponent
                    data={filteredDisciples}
                    columns={DisciplesColumnsTable}
                    defaultPageSize={20}
                />
            </div>
        </>
    );
};

export default Disciples;