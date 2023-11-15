// Import react
import { useState } from 'react';

// Import redux
import CustomButton from '../../components/Button/Button';

// Import components
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';

// Import style
import './Login.scss';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [signingUp, setSigningUp] = useState(false);
  const [forgettingPassword, setForgettingPassword] = useState(false);

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <div className="login_root">
      <div className="login_container">
        <div className="login_row">
          <div className="login_body">
            {forgettingPassword ? <ForgotPassword setForgettingPassword={setForgettingPassword}/> : 
            <>
            <div
              className="login_title"
            >
              Welcome back!
            </div>
            <div
              className="login_subtitle"
            >
              Ready to solve some problem with peers?
            </div>
            <div className="login_form_container">
              {signingUp ? <SignUpForm setSigningUp={setSigningUp}/> : <LogInForm/>}
            </div>
            <div>
              {signingUp ?
                <div>
                  Already have an account? <CustomButton title="Log In" event={() => setSigningUp(false)} />
                </div> :
                <>
                <div>
                  Don't have an account? <CustomButton title="Register" event={() => setSigningUp(true)} />
                </div>
                <CustomButton 
                  title="Forgot Password"
                  event={() => setForgettingPassword(true)}
                  style={{height: 40, width: 200, marginTop: 2}} 
                />
                </>
              }
            </div>
            </>}
          </div>
        </div>
        
      </div>
      <div className="logo_container">
        <div className="logo_row">
          <img src={'login/login_page_logo.svg'} width={640} height={640} alt="logo" />
        </div>
      </div>
    </div>
  );
}

export default Login;