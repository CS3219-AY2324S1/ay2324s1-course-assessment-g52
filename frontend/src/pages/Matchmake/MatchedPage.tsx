import { Stack, Typography } from "@mui/material";
import Button from '../../components/Button/Button'
import { useNavigate, useParams } from "react-router-dom";
const MatchedPage = () => {
  const navigate = useNavigate();
  const { questionId, otherUserId } = useParams();

  return (
    <div>
      <Stack
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
      >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          
          fontWeight: "bold",
          fontSize: "50px",
        }}
      >
        You have been matched!
      </Typography>
      <Button
        title="Go to Room"
        style={{
          height: "50px",
        }}
        event={() => navigate(`/app/collaboration/${questionId}/${otherUserId}`)}
      />
      </Stack>
      
    </div>
  );
}

export default MatchedPage;
