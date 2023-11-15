// Import react
import { Navigate } from "react-router-dom";

// Import pages
import Dashboard from './pages/Dashboard/Dashboard';
import Collaboration from './pages/Collaboration/Collaboration';
import Matchmake from './pages/Matchmake/Matchmake';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import Login from './pages/Login/Login';
import MatchedPage from "./pages/Matchmake/MatchedPage";
import ChangePasswordForm from './pages/ChangePassword/ChangePassword';
import DeleteAccountForm from './pages/DeleteAccount/DeleteAccountForm';
import { Typography } from "@mui/material";
import History from "./pages/History/History";

const routes = (isLoggedIn: boolean, isMatching: boolean) => {
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
        { path: 'dashboard', element: isMatching ? <Matchmake /> : <Dashboard /> },
        { path: 'collaboration/:questionId?/:otherUserId?', element: isMatching ? <Matchmake /> : <Collaboration /> },
        { path: "matched/:questionId?/:otherUserId?", element: isMatching ? <Matchmake /> : <MatchedPage />},
        {
          path: 'change-password',
          element: <ChangePasswordForm />,
        },
        {
          path: 'delete-account',
          element: <DeleteAccountForm />
        },
        {
          path: 'history',
          element: isMatching ? <Matchmake /> : <History />
        }
      ],
    },
    {
      path: "login",
      element: !isLoggedIn ? <Login /> : <Navigate to="/app/dashboard" />,
    },
    {
      path: "*",
      element: isLoggedIn ? (
        <div>
          <DashboardLayout/>
          <Typography
            variant={"h1"}
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              textAlign: "center",
              marginTop: 5,
            }}
          >
            404 Not Found
          </Typography>
        </div>
      ) : (
        <Navigate to="/login" />
      ),
    },
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
