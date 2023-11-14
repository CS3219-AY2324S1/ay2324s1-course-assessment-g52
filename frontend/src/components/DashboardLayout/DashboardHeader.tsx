// Import react
import React, {useState} from 'react';

// Import MUI
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

// Import style
import './Dashboard.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const DashboardHeader = () => {
  //----------------------------------------------------------------//
  //                          HOOKS                                 //
  //----------------------------------------------------------------//
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
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
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully!");
  };
  const handleChangePassword = () => {
    setAnchorElUser(null);
    navigate("/app/change-password");
  }
  const handleDeleteAccount = () => {
    setAnchorElUser(null);
    navigate("/app/delete-account");
  }
  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <AppBar position='sticky' className="dashboard_header">
      <Container maxWidth="xl">
        <Toolbar sx={{mr: 10, ml: 10}} disableGutters className='dashboard_header__toolbar'>
          <Button
            onClick={() => navigate('/app/dashboard')}
          >
          <Typography variant="h6" noWrap
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Peer Prep
          </Typography>
          </Button>
          
          <Stack
            direction={'row'}
            spacing={5}
          >
          </Stack>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User" />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => ( */}
              <MenuItem key={"logout"} onClick={handleChangePassword}>
                <Typography textAlign="center">{"Change Password"}</Typography>
              </MenuItem>
              <MenuItem key={"logout"} onClick={handleLogout}>
                <Typography textAlign="center">{"Log Out"}</Typography>
              </MenuItem>
              <MenuItem key={"logout"} onClick={handleDeleteAccount}>
                <Typography textAlign="center">{"Delete Account"}</Typography>
              </MenuItem>
              {/* ))} */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default DashboardHeader;