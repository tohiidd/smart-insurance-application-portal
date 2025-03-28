import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Navigation from './components/Navigation';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';

function App() {
  return (
    <Router>
      <Navigation />
      <Container>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
