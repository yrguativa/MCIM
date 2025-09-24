
import React from 'react';
import { Link } from 'react-router-dom';

import { Plus } from 'lucide-react';

import TableComponent from '@/src/app/components/TableComponent';
import { ColumnsAssistants } from '../components/assistantsColumnsTable';
import { buttonVariants } from "@/components/ui/button";

import { useCellStore } from '../store/cell.store';
import { useTranslation } from 'react-i18next';

const Cells: React.FC = () => {
  const { t } = useTranslation();
  const cellsState = useCellStore(state => state.Cells);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{t('cells.title')}</h1>
        <Link to="/cell" className={buttonVariants({ variant: "outline" }) + " mr-14"}>
          <Plus className="mr-2" />{t('cells.new')}
        </Link>
      </div>
      <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
        <TableComponent data={cellsState} columns={ColumnsAssistants}></TableComponent>
      </div >
    </>
  );
};

export default Cells;
