
import React from 'react';
import { useCellStore } from '../../stores';
import AssistantsTableComponent from '../components/assistantsTableComponent';
import { ColumnsAssistants } from '../components/assistantsColumnsTable';

const Cells: React.FC = () => {
  const cellsState = useCellStore(state => state.Cells);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Celulas</h1>
      </div>
      <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm" x-chunk="dashboard-02-chunk-1">

        <AssistantsTableComponent data={cellsState} columns={ColumnsAssistants}></AssistantsTableComponent>
      </div >
    </>
  );
};

export default Cells;
