import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Navigation />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
              Topsite Personal Trainer
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/trainings" element={<TrainingList />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}

export default App;