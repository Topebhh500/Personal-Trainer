// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import TrainingCalendar from './components/TrainingCalendar';
import Navigation from './components/Navigation';
import TrainingStats from './components/TrainingStats';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Navigation />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
                Personal Trainer
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<TrainingStats />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/trainings" element={<TrainingList />} />
              <Route path="/calendar" element={<TrainingCalendar />} />
              <Route path="/statistics" element={<TrainingStats />} />
            </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;