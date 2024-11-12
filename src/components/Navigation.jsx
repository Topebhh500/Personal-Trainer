import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function Navigation() {
  return (
    <div>
      <Button
        color="inherit"
        component={Link}
        to="/customers"
        startIcon={<PeopleIcon />}
      >
        Customers
      </Button>
      <Button
        color="inherit"
        component={Link}
        to="/trainings"
        startIcon={<FitnessCenterIcon />} 
      >
        Trainings
      </Button>
    </div>
  );
}

export default Navigation;