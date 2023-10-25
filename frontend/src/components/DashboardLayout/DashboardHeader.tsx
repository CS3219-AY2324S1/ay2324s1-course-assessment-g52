// Import react
import React, { useEffect, useState } from "react";
import { useFindMatchMutation } from "../../redux/api";

// Import redux
import { useSelector, useDispatch } from "react-redux";
import { initMatch } from "../../redux/slices/matchSlice";

// Import MUI
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { getAuth, signOut } from "firebase/auth";

// Import style
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { set } from "lodash";
import { firebaseAuth } from "../../utils/firebase";

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const DashboardHeader = () => {
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [findMatch, {}] = useFindMatchMutation();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  const isMatchButtonEnabled = useSelector(
    (state: any) => state.isMatching.isMatchButtonEnabled
  );
  //----------------------------------------------------------------//
  //                         HANDLERS                               //
  //----------------------------------------------------------------//
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/");
        toast.success("Logged out successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error! Could not log out!");
      });
  };

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in. Get the user's email and token.
        const email = user?.email;
        user.getIdToken().then((token) => {
          setUserEmail(email);
          setUserToken(token);
        });
      } else {
        // User is signed out.
        setUserEmail(null);
        setUserToken(null);
      }
    });

    // Clean up the listener when the component unmounts.
    return () => {
      unsubscribe();
    };
  }, []);

  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <AppBar position="sticky" className="dashboard_header">
      <Container maxWidth="xl">
        <Toolbar
          sx={{ mr: 10, ml: 10 }}
          disableGutters
          className="dashboard_header__toolbar"
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            Peer Prep
          </Typography>
          <Stack direction={"row"} spacing={5}>
            <IconButton
              sx={{
                color: "black",
                backgroundColor: "white",
                height: 53,
                borderRadius: 14,
                border: "3px solid black",
                "&:hover": {
                  color: "black",
                  border: "3px solid black",
                },
                width: "140px",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: 13,
              }}
              disableRipple
              disabled={!isMatchButtonEnabled}
              onClick={() => {
                findMatch({
                  id: userToken ? userToken : "",
                  email: userEmail ? userEmail : "",
                  topic: "",
                  difficulty: "",
                }).then((res) => {
                  console.log(res);
                  dispatch(initMatch(true));
                });
              }}
            >
              Quick Match
            </IconButton>
          </Stack>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User" />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => ( */}
              <MenuItem key={"logout"} onClick={handleLogout}>
                <Typography textAlign="center">{"Log Out"}</Typography>
              </MenuItem>
              {/* ))} */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default DashboardHeader;
