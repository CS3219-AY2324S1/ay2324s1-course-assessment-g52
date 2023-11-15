// Import React
import { useState } from 'react';

// Import MUI
import {
    FormControl,
    IconButton,
    Paper,
    Stack,
    TextField,
} from '@mui/material';

// Import redux

// Import toast
import { toast } from 'react-toastify';
import { reauthenticateWithCredential, getAuth, Auth, AuthCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

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

const ChangePasswordForm = () => {

  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const [retypePassword, setRetypePassword] = useState('');
  const auth: Auth = getAuth()
  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonDisabled(true);
    if (newPassword !== retypePassword) {
      toast.error('Passwords do not match!');
      setButtonDisabled(false);
      return;
    }
    if (newPassword == oldPassword) {
      toast.error('New password cannot be the same as the old password!');
      setButtonDisabled(false);
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters!');
      setButtonDisabled(false);
      return;
    }
    const credentials: AuthCredential = EmailAuthProvider.credential(auth!.currentUser!.email!, oldPassword);
    reauthenticateWithCredential(auth!.currentUser!, credentials).then((res) => {
      console.log(res);
      updatePassword(auth!.currentUser!, newPassword).then(() => {
        toast.success("Password changed successfully!");
        setButtonDisabled(false);
        navigate('/app/dashboard', { replace: true });
      }).catch((err: FirebaseError) => {
        console.log(err.message)
        toast.error("Something went wrong!");
        setButtonDisabled(false);
        return;
      });
    }).catch((err: FirebaseError) => {
      console.log(err.message)
      toast.error(err.message);
      setButtonDisabled(false);
      return;
    });
  };

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
      onSubmit={(e) => handleChangePassword(e)}
      >
      <FormControl
        sx={{ width: '100%', mt: 10, mb: 10 }}
        variant="standard"
      >
        <Stack spacing={8}>
          <TextField
              id="oldPassword"
              label="Old Password"
              type="password"
              variant='standard'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={textInputStyle}
              required
              InputLabelProps={{ required: false, style: { fontFamily: 'Poppins' }}}
              inputProps={{autoComplete: 'old-password',
              form: {
                autoComplete: 'off',
              },  style: { fontFamily: 'Poppins' }}}
          >
          </TextField>
          <TextField
              id="password"
              label="Password"
              type="password"
              variant='standard'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              Change Password
          </IconButton>
        </Stack>
      </FormControl>
    </form>
    </Stack>
    </Paper>

  );
}

export default ChangePasswordForm;
