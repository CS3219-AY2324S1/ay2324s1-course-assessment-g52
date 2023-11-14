// Import react
import { useRoutes } from 'react-router-dom';

// Import redux
import { useDispatch } from 'react-redux';

// Import routes
import routes from './routes';

import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss'
import { userLogin } from './redux/slices/userSlice';
import { User } from './utils/types';
import { useEffect } from 'react';

const App = () => {
  // const { isLoggedIn } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(userLogin(JSON.parse(localStorage.getItem('user') || "") as User));
    }
  }, [token]);

  const routing = useRoutes(routes(user != null));

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
