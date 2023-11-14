// Import MUI
import {
  AppBar,
  Container,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

// Import style
import './Dashboard.scss';

const DashboardHeader = () => {
  //----------------------------------------------------------------//
  //                          RENDER                                //
  //----------------------------------------------------------------//
  return (
    <AppBar position='sticky' className="dashboard_header">
      <Container maxWidth="xl">
        <Toolbar sx={{mr: 10, ml: 10}} disableGutters className='dashboard_header__toolbar'>
          <Typography variant="h6" noWrap component="a" href="/"
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
          <Stack
            direction={'row'}
            spacing={5}
          >
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default DashboardHeader;