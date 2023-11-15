// Import React
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import MUI
import {
    FormControl,
    IconButton,
    Stack,
    TextField,
} from '@mui/material';

// Import toast
import { toast } from 'react-toastify';

// Import firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from '../../utils/firebase';
import { useCreateUserMutation } from '../../redux/api';

const textInputStyle = {
  "& label.Mui-focused": {
    color: 'rgba(0, 0, 0, 0.6)'
  },
  "borderBottom": '2px solid black',
  '& .MuiInput-underline:before': { borderBottomColor: 'black' },
  '& .MuiInput-underline:after': { borderBottomColor: 'black' },
  input: {
    '&:-webkit-autofill::first-line': {
      'color': 'green',
      'fontSize': '13px'
    },
    '&:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 100px #ffff inset',
      '-webkit-text-fill-color': 'black',
      'fontSize': '13px'
    },
  },
}

const LogInForm = () => {
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUser] = useCreateUserMutation()
  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    signInWithEmailAndPassword(firebaseAuth, email, password).then((res) => {
      setButtonDisabled(false);
      const createUserPromise = new Promise( async (resolve, reject) => {
        try {
          const newRes: any = await createUser({firebaseId: res!.user!.uid, email}).unwrap();
          return resolve(newRes);
        } catch (error: any) {
          setButtonDisabled(false);
          return reject(error);
        }
      });
      createUserPromise.then((res: any | null) => {
        return res
      }).catch((err) => {
        return err
      })
      navigate('/app/dashboard');
      toast.success('Welcome back!');
//     const loginPromise = new Promise( async (resolve, reject) => {
//       try {
//         const res = await login({email, password}).unwrap();
//         setButtonDisabled(false);
//         return resolve(res);
//       } catch (error: any) {
//         setButtonDisabled(false);
//         return reject(error);
//       }
//     });
//     loginPromise.then((res: any | User | null) => {
//         toast.success('Welcome back!');
//         localStorage.setItem('token', 'dummyToken');
//         localStorage.setItem('user', JSON.stringify(res));
//         navigate('/app/dashboard');
    }).catch((err) => {
      console.error(err);
      toast.error("Login Failed!");
      setButtonDisabled(false);
    })
  };

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <form
      onSubmit={(e) => handleLogin(e)}
    >
      <FormControl
        sx={{ width: '100%', mt: 10, mb: 10 }}
        variant="standard"
      >
        <Stack spacing={8}>
          <TextField
            id="email"
            label="Email"
            type="email"
            variant='standard'
            sx={textInputStyle}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ required: false, style: { fontFamily: 'Poppins' }}}
            inputProps={{style: { fontFamily: 'Poppins' }}}
          >
            <label>Email</label>
            <input type="text" />
          </TextField>
          <TextField
            id="password"
            label="Password"
            type="password"
            variant='standard'
            sx={textInputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            SelectProps={{style: {color: 'black'}}}
            required
            inputProps={{
              autoComplete: 'off',
              form: {
                  autoComplete: 'off',
              },
              style: { fontFamily: 'Poppins' }
            }}
            InputLabelProps={{ required: false, style: { fontFamily: 'Poppins' }}}
          />
          <IconButton
            sx={{
              color: 'black',
              backgroundColor: '#FFD900',
              height: 53,
              borderRadius: 14,
              border: '3px solid black',
              "&:hover": {
                color: 'black',
                border: '3px solid black',
              },
              width: '100%',
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: 13,
            }}
            disabled={buttonDisabled}
            type="submit"
            disableRipple
          >
            Log In
          </IconButton>
        </Stack>
      </FormControl>
    </form>
  )
}

export default LogInForm;
