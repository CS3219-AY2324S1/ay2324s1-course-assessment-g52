// Import react
import { Outlet } from 'react-router-dom';

// Import components
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <>
      <DashboardHeader />
      <Outlet />
    </>
  );
};

export default DashboardLayout;
