
import React from 'react';
import { Link } from 'react-router-dom';
import { useCellStore } from '../../stores';
import AssistantsTableComponent from '../components/assistantsTableComponent';
import { ColumnsAssistants } from '../components/assistantsColumnsTable';
import { Plus } from 'lucide-react';
import { buttonVariants } from "@/components/ui/button"


const Cells: React.FC = () => {
  const cellsState = useCellStore(state => state.Cells);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Celulas</h1>
        <Link to="/cell" className={buttonVariants({ variant: "outline" }) + " mr-14"}>
          <Plus className="mr-2" />Nueva Celula
        </Link>
      </div>
      <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
        <AssistantsTableComponent data={cellsState} columns={ColumnsAssistants}></AssistantsTableComponent>
      </div >
    </>
  );
};

export default Cells;
