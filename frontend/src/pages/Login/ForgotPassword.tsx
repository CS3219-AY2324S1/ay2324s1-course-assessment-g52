import { Stack } from "@mui/material";
import Button from "../../components/Button/Button";

type ForgotPasswordProps = {
    setForgettingPassword: Function
}
const ForgotPassword = (props: ForgotPasswordProps) => {
  const { setForgettingPassword } = props;
  return ( 
    <div>
      <Stack>
        <p>
            Please contact the system administrator to reset your password.
        </p>
        <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
        <Stack>
          <Button 
              title={"Go Back"}
              event={() => setForgettingPassword(false)}
          />
        </Stack>
        
        </Stack>
      
      </Stack>
    </div>
  )
}

export default ForgotPassword;
