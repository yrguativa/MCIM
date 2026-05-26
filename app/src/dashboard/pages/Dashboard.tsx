import React, { Suspense, useEffect } from 'react';
import { ProgressIndeterminate } from "@/components/ui/progress-indeterminate"
import MenuMain from '@/src/dashboard/components/MenuMain';
import MenuMovil from '@/src/dashboard/components/MenuMovil';
import MobileNavBar from '@/src/dashboard/components/MobileNavBar';

import { useMinistryStore } from '@/src/ministries/store/ministries.store';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useCellStore } from '@/src/cells/store/cell.store';

import { DashboardRoutes } from '../routes';

const DashboardPage: React.FC = () => {
  const getDisciplesState = useDiscipleStore(state => state.getDisciples);
  const getMinistries = useMinistryStore(state => state.getMinistries);
  const getCells = useCellStore(state => state.getCells);

  useEffect(() => {
    getDisciplesState();
    getMinistries();
    getCells();
  }, []);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <MenuMovil />
      <div className="flex flex-col">
        <MenuMain />
        <main className="flex flex-1 flex-col gap-4 p-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:gap-6 lg:p-6 lg:pb-6">
          <Suspense fallback={<ProgressIndeterminate />}>
            <DashboardRoutes />
          </Suspense>
        </main>
      </div>
      <MobileNavBar />
    </div>

  )
}

export default DashboardPage;