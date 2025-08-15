import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pen, Plus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMinistryStore } from '../store';

export const Ministries = () => {
    const navigate = useNavigate();
    const { ministries, getMinistries } = useMinistryStore();

    useEffect(() => {
        getMinistries();
    }, [getMinistries]);

    const handleEdit = (id: string) => {
        navigate(`/ministries/${id}`);
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Ministerios</h1>
                <Link to="/ministries/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Ministerio
                    </Button>
                </Link>
            </div>

            <Card>
                <Table>
                    <TableCaption>Lista de ministerios registrados</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Líder</TableHead>
                            <TableHead>Ministerio Padre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ministries.map((ministry) => (
                            <TableRow key={ministry.id}>
                                <TableCell className="font-medium">{ministry.name}</TableCell>
                                <TableCell>
                                    {ministry.leader?.name || 'Sin líder asignado'}
                                </TableCell>
                                <TableCell>
                                    {ministry.parentMinistry?.name || 'Ministerio principal'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={ministry.active ? "default" : "destructive"}>
                                        {ministry.active ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleEdit(ministry.id!)}
                                    >
                                        <Pen className="mr-2" />  Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {ministries.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6">
                                    No hay ministerios registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};
