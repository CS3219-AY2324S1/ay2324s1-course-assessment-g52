import { Paper, Stack, Typography } from "@mui/material"
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const LinksCard = () => {
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        width: "100%",
        height: "fit-content",
        padding: 5,
        borderRadius: 5,
      }}
    >
      <Stack
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={3}
        sx={{
          width: "100%",
        }}
      >
        <Typography
          variant={"h5"}
          sx={{
            width: "100%",
            textAlign: "center",
            fontFamily: "Poppins",
            fontWeight: 600,
          }}
        >
          Links
        </Typography>
        <Button
          title={"History"}
          event={() => navigate("/app/history")}
          style={{
            width: "100%",
            height: "fit-content",
            borderRadius: 5,
          }}
        />
      </Stack>
  </Paper>
  );
}

export default LinksCard;
