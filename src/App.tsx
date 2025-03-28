import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navigation from './components/Navigation';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <Navigation />
        <Container>
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
          </Routes>
        </Container>
      </ToastProvider>
    </Router>
  );
}

export default App;
