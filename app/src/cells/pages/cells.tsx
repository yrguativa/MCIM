import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Plus, Users, BarChart3, FileText } from 'lucide-react';

import TableComponent from '@/src/app/components/TableComponent';
import { getColumnsAssistants } from '../components/assistantsColumnsTable';
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useCellStore } from '../store/cell.store';
import { useTranslation } from 'react-i18next';

const Cells: React.FC = () => {
  const { t } = useTranslation();
  const cellsState = useCellStore(state => state.Cells);
  const getCells = useCellStore(state => state.getCells);

  useEffect(() => {
    getCells();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">{t('cells.title')}</h1>
        <Link to="/cells/create" className={buttonVariants({ variant: "outline" }) + " mr-14"}>
          <Plus className="mr-2" />{t('cells.new')}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.stats.totalCells')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cellsState.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.stats.charts')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-16 w-full rounded-md bg-muted animate-pulse" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('cells.stats.reports')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-16 w-full rounded-md bg-muted animate-pulse" />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
        <TableComponent data={cellsState} columns={getColumnsAssistants(t)}></TableComponent>
      </div>
    </>
  );
};

export default Cells;
