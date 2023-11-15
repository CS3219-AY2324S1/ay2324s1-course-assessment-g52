import { IconButton } from "@mui/material";
import React from "react";

type ButtonProps = {
  title: string;
  event: (e: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
  buttonStatus?: boolean;
};

const Button = (props: ButtonProps) => {
  const { title, event, style, buttonStatus } = props;

  return (
    <IconButton
      sx={{
        color: "black",
        backgroundColor: "white",
        height: 33,
        width: 100,
        borderRadius: 14,
        border: "3px solid black",
        "&:hover": {
          transition: "border .5s, background .5s, color .5s",
          color: 'black',
          border: '3px solid black',
        },
        fontFamily: "Poppins",
        fontWeight: 600,
        fontSize: 13,
        ...style,
      }}
      disableRipple
      disabled={buttonStatus}
      onClick={event}
    >
      {title}
    </IconButton>
  );
};

export default Button;
