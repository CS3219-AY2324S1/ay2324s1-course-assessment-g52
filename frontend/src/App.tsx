// Import react
import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
// Import MUI
import {
  Paper,
  Stack,
} from '@mui/material';

// Import redux
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';

// Import routes
import routes from './routes';

// Import toast
import { ToastContainer, Slide } from 'react-toastify';

// Import components
import Loading from './components/Loading/Loading';

// Import firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { setToken } from './redux/slices/authSlice';

// Import socket
import { socket } from './utils/socket';

// Import context
import { SocketContext } from './contexts';

// Import styles
import 'react-toastify/dist/ReactToastify.css';
import './App.scss'

import { Socket} from "socket.io-client";
const App = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const [soc, setSoc] = useState<Socket | null>(null);
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  useEffect (() => {
    auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
      dispatch(setToken(idTokenResult.token));
      setSoc(socket(auth.currentUser!.uid!, idTokenResult.token));
    })
  }, [auth.currentUser]);

  const [user, loading] = useAuthState(auth);

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  if (loading) {
    return (
      <Paper sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Stack sx={{
          height: '100vh',
          justifyContent: 'center',
        }}>
          <Loading />
        </Stack>
      </Paper>
    );
  }

  const routing = useRoutes(routes(user != null));
    return (
      <SocketContext.Provider value={soc}>
        {routing}
        <ToastContainer
          pauseOnFocusLoss={false}
          transition={Slide}
        />
      </SocketContext.Provider>
    );
}

export default App;
