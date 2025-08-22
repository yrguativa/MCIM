import React, { useEffect } from 'react';

import { useMinistryStore } from '@/src/ministries/store';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';

import MenuMain from '../components/MenuMain';
import MenuMovil from '../components/MenuMovil';
import { DashboardRoutes } from '../routes';

const DashboardPage: React.FC = () => {
  const getDisciplesState = useDiscipleStore(state => state.getDisciples);
  const getMinistries = useMinistryStore(state => state.getMinistries);

  useEffect(() => {
    getDisciplesState();
    getMinistries();
  }, []);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <MenuMovil />
      <div className="flex flex-col">
        <MenuMain />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <DashboardRoutes />
        </main>
      </div>
    </div>

  )
}

export default DashboardPage;