
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import ProtectedRoutes from './auth/ProtectedRoutes';
import Login from "./Login";
import Register from './Register';
import Me from './auth/Me'
import Logout from './auth/Logout'
import Dashboard from './Dashboard';
import ProjectsTable from './ProjectsTable';
import GanttChart from './GanttChart';
import TicketsCreatedByTable from './TicketsCreatedByTable';

async function loadFlyonUI() {
  return import('flyonui/flyonui');
}

function App() {

  useEffect(() => {
    const initFlyonUI = async () => {
      await loadFlyonUI();
    };

    initFlyonUI();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        window.HSStaticMethods
      ) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }, []);

  return (
    <>
      <Routes>
        
        <Route path="/me" element={<Me />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoutes  allowedRoles={['admin', 'user']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsTable />} />
          <Route path="/gantt" element={<GanttChart />} />
          <Route path="/tickets-by" element={<TicketsCreatedByTable />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
