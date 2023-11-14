// Import react
import { Navigate } from "react-router-dom";

// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import Login from './pages/Login/Login';
import ChangePasswordForm from './pages/ChangePassword/ChangePassword';
import DeleteAccountForm from './pages/DeleteAccount/DeleteAccountForm';

const routes = (isLoggedIn: boolean) => {
  const r = [];
  const loggedInRoutes = [
    {
      path: "",
      element: !isLoggedIn ? (
        <Navigate to="/login" />
      ) : (
        <Navigate to="/app/dashboard" />
      ),
      children: [
        { path: "login", element: <>Logasdin</> },
        { path: "", element: <Navigate to="/login" /> },
      ],
    },
    {
      path: "app",
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <Dashboard /> },
        {
          path: 'change-password',
          element: <ChangePasswordForm />,
        },
        {
          path: 'delete-account',
          element: <DeleteAccountForm />
        }
      ],
    },
    
    {
      path: "login",
      element: !isLoggedIn ? <Login /> : <Navigate to="/app/dashboard" />,
    },
    {
      path: "*",
      element: !isLoggedIn ? (
        <Navigate to="/login" />
      ) : (
        <Navigate to="/app/dashboard" />
      ),
      children: [
        { path: "login", element: <>Logasdin</> },
        { path: "", element: <Navigate to="/login" /> },
      ],
    },
  ];
  const loggedOutRoutes = [
    {
      path: "login",
      element: !isLoggedIn ? <Login /> : <Navigate to="/app/dashboard" />,
    },
    {
      path: "*",
      element: !isLoggedIn ? (
        <Navigate to="/login" />
      ) : (
        <Navigate to="/app/dashboard" />
      ),
      children: [
        { path: "login", element: <Login /> },
        { path: "", element: <Navigate to="/login" /> },
      ],
    },
  ];
  r.push(...(isLoggedIn ? loggedInRoutes : loggedOutRoutes));
  return r;
};

export default routes;
