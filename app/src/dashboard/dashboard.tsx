import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cells from "../cells/pages/cells"
import { useDiscipleStore } from "../stores"
import CellRegister from '../cells/pages/cellRegister';
import CellForm from '../cells/pages/cellForm';
import { CreateEvent } from '../events/pages/CreateEvent';
import { ScanQR } from '../events/pages/ScanQR';
import { WeeklyCalendar } from '../events/pages/WeeklyCalendar';
import { MinistryRoutes } from '../ministries/routes';
import { DisciplesRoutes } from '../disciples/routes';
import { useMinistryStore } from '../stores/ministry';
import HomePage from './pages/homePage';
import MenuMovil from './components/menuMovil';
import MenuApp from './components/menuApp';

const Dashboard: React.FC = () => {

  const getDisciplesState = useDiscipleStore(state => state.getDisciples);
  const getMinistries = useMinistryStore(state => state.getMinistries);

  useEffect(() => {
    getDisciplesState();
    getMinistries();
  }, []);

  return (
    <Router>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <MenuApp />
        <div className="flex flex-col">
          <MenuMovil />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Routes>
              <Route path="/dashboard/" element={<HomePage />} />
              <Route path="/cell/" element={<Cells />} />
              <Route path="/cell/:id" element={<CellForm />} />
              <Route path="/cell/:id/register" element={<CellRegister />} />

              <Route path="/disciples/*" element={<DisciplesRoutes />} />


              <Route path="/events" element={<WeeklyCalendar />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/scan" element={<ScanQR />} />

              <Route path="/ministries/*" element={<MinistryRoutes />} />
            </Routes>

          </main>
        </div>
      </div>
    </Router>
  )
}

export default Dashboard;