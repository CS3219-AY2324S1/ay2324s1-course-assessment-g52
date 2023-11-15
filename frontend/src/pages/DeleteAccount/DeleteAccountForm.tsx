// Import React
import { useState } from 'react';

// Import MUI
import {
    FormControl,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { reauthenticateWithCredential, getAuth, Auth, AuthCredential, EmailAuthProvider, deleteUser } from "firebase/auth";

// Import toast
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { FirebaseError } from '@firebase/util';

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

const DeleteAccountForm = () => {

  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const navigate = useNavigate();
  const [areYouSure, setAreYouSure] = useState(false);
  const auth: Auth = getAuth();  
  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleDeleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    if (password !== retypePassword) {
      toast.error('Passwords do not match!');
      setButtonDisabled(false);
      return;
    } 
    const credential: AuthCredential = EmailAuthProvider.credential(
      auth.currentUser?.email || '',
      password
    );
    reauthenticateWithCredential(auth.currentUser!, credential)
      .then(() => {
        deleteUser(auth.currentUser!)
          .then(() => {
            toast.success('Account deleted successfully!');
            navigate('/login');
          })
          .catch((error: FirebaseError) => {
            toast.error(error.message);
            setButtonDisabled(false);
          });
      })
      .catch((error: FirebaseError) => {
        toast.error(error.message);
        setButtonDisabled(false);
      });
  };
  const handleDeleteButtonClick = () => {
    if (!password || !retypePassword) {
      toast.error('Please fill out all fields!');
      return;
    }
    if (password !== retypePassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setAreYouSure(true);
  }
  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <Paper
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
    <Stack
      sx={{
        width: '40%'
      }}
    >
    <form
      onSubmit={(e) => handleDeleteAccount(e)}
      >
      <FormControl
        sx={{ width: '100%', mt: 10, mb: 10 }}
        variant="standard"
      >
          <TextField
              id="password"
              label="Password"
              type="password"
              variant='standard'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textInputStyle}
              SelectProps={{style: {color: 'black'}}}
              required
              inputProps={{
                autoComplete: 'off',
                form: {
                  autoComplete: 'off',
                },
                style: { fontFamily: 'Poppins' }}}
              InputLabelProps={{ required: false, style: { fontFamily: 'Poppins' }}}
          />
           <TextField
              id="retype-password"
              label="Re-type Password"
              type="password"
              variant='standard'
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              sx={textInputStyle}
              SelectProps={{style: {color: 'black'}}}
              required
              inputProps={{style: { fontFamily: 'Poppins' }}}
              InputLabelProps={{ required: false, style: { fontFamily: 'Poppins' }}}
          />
          <Stack
            sx={{ marginTop: 2}}
          >
          {areYouSure ?
          <Stack
          >
            <Typography>
              Are you REALLY sure?
            </Typography>
            <Stack>
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
              onClick={() => setAreYouSure(false)}
              disableRipple
            >
              No
            </IconButton>
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
              Yes
            </IconButton>
            </Stack>
            
          </Stack> :
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
            onClick={handleDeleteButtonClick}
            disableRipple
          >
            Delete Account
          </IconButton>
          }
                    </Stack>

      </FormControl>
    </form>
    </Stack>
    </Paper>

  );
}

export default DeleteAccountForm;
