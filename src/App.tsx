import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Navigation from './components/Layout/Navigation';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';
import { ToastProvider } from './context/ToastContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from './context/ThemeContext';
import { createAppTheme } from './theme/theme';

function App() {
  const { isDarkMode } = useTheme();
  const theme = createAppTheme(isDarkMode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ToastProvider>
            <Navigation />
            <Box
              sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary',
                p: 3,
              }}
            >
              <Routes>
                <Route path="/" element={<FormPage />} />
                <Route path="/submissions" element={<SubmissionsPage />} />
              </Routes>
            </Box>
          </ToastProvider>
        </LocalizationProvider>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
