import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Navigation from './components/Layout/Navigation';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';
import { ToastProvider } from './context/ToastContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ToastProvider>
          <Navigation />
          <Container>
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
            </Routes>
          </Container>
        </ToastProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;
