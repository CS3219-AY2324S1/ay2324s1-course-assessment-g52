import { Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

const routes = () => {
  const r = [];
  const loggedInRoutes = [
    {
      path: '*',
      element:  <Navigate to="/app/dashboard" />,
    },
    {
      path: 'app',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <Dashboard /> },

      ],
    },
  ];
  r.push(...loggedInRoutes);
  return r;
};

export default routes;