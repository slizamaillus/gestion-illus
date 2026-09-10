/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import TaskDetailModal from './components/tasks/TaskDetailModal';
import Portfolios from './pages/Portfolios';
import Projects from './pages/Projects';
import MyTasks from './pages/MyTasks';
import CalendarView from './pages/CalendarView';
import Notifications from './pages/Notifications';
import Teams from './pages/Teams';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="portfolios" element={<Portfolios />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="notifications" element={<Notifications />} />
          
          <Route path="projects/:projectId" element={<ProjectDetail />}>
            <Route path="tasks/:taskId" element={<TaskDetailModal />} />
          </Route>
          
          <Route path="*" element={<div className="p-8 text-center text-slate-500">Página no encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
