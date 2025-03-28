import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function Navigation() {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Insurance Portal
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          sx={{
            backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Form
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/submissions"
          sx={{
            backgroundColor: location.pathname === '/submissions' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Submissions
        </Button>
      </Toolbar>
    </AppBar>
  );
}
