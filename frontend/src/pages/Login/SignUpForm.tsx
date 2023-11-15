// Import React
import { useState } from 'react';

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
import { firebaseAuth,  } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
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
type SignUpFormProps = {
  setSigningUp: Function
}

const SignUpForm = (props: SignUpFormProps) => {
  const { setSigningUp } = props;
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [createUser] = useCreateUserMutation();
  
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [email, setEmail] = useState('');

  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleSignUp = () => {
    // e.preventDefault();
    setButtonDisabled(true);
    if (password !== retypePassword) {
      toast.error('Passwords do not match!');
      setButtonDisabled(false);
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      setButtonDisabled(false);
      return;
    }
    createUserWithEmailAndPassword(firebaseAuth, email, password).then((res:any) => {
      setSigningUp(false);
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
      toast.success('Account Successfully Created!');
    }).catch((err) => {
      console.error(err);
      toast.error("Email is already in use!");
      setButtonDisabled(false);
    });
  };

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <form
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textInputStyle}
              required
              InputLabelProps={{ required: false, style: { fontFamily: 'Poppins' }}}
              inputProps={{autoComplete: 'new-password',
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
              // type="submit"
              disableRipple
              onClick={handleSignUp}
          >
              Sign Up
          </IconButton>
        </Stack>
      </FormControl>
    </form>
  );
}

export default SignUpForm;
