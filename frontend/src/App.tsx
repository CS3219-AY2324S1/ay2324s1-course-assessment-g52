// Import react
import { useRoutes } from 'react-router-dom';

// Import routes
import routes from './routes';

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss'

const App = () => {
  const routing = useRoutes(routes());
  return (
    <>
      {routing}
      <ToastContainer
        pauseOnFocusLoss={false}
        transition={Slide}
      />
    </>
  );
}

export default App;
