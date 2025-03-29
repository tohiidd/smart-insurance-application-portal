import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../../context/ThemeContext';

export default function Navigation() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: isDarkMode ? 'background.paper' : 'primary.main',
        '& .MuiToolbar-root': {
          justifyContent: 'space-between',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Insurance Portal
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{
              color: isDarkMode ? 'text.primary' : 'inherit',
              bgcolor: location.pathname === '/' ? (isDarkMode ? 'action.selected' : 'primary.dark') : 'transparent',
              '&:hover': {
                bgcolor: isDarkMode ? 'action.hover' : 'primary.dark',
              },
            }}
          >
            New Application
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/submissions"
            sx={{
              color: isDarkMode ? 'text.primary' : 'inherit',
              bgcolor: location.pathname === '/submissions' ? (isDarkMode ? 'action.selected' : 'primary.dark') : 'transparent',
              '&:hover': {
                bgcolor: isDarkMode ? 'action.hover' : 'primary.dark',
              },
            }}
          >
            Submissions
          </Button>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{
              color: isDarkMode ? 'text.primary' : 'inherit',
              '&:hover': {
                bgcolor: isDarkMode ? 'action.hover' : 'primary.dark',
              },
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
