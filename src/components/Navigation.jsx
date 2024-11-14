// Navigation.jsx
import { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  ListItemButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { systemService } from '../services/api';
import { Snackbar, Alert } from '@mui/material';

function Navigation() {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const toggleDrawer = (isOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(isOpen);
  };

  const handleReset = async () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset the database? This will delete all current data and restore demo data.'
    );
    
    if (confirmReset) {
      try {
        const result = await systemService.resetDatabase();
        if (result) {
          showSnackbar('Database reset successfully', 'success');
          // Wait a bit before reloading to show the success message
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showSnackbar('Database reset failed', 'error');
        }
      } catch (error) {
        console.error('Error resetting database:', error);
        showSnackbar(
          `Failed to reset database: ${error.message || 'Unknown error'}`, 
          'error'
        );
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const menuItems = [
    { text: 'Dashboard', icon: <BarChartIcon />, path: '/statistics' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
    { text: 'Trainings', icon: <FitnessCenterIcon />, path: '/trainings' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendar' },
    { 
      text: 'Reset Database', 
      icon: <RestartAltIcon />, 
      onClick: handleReset,
      color: 'warning' 
    }
  ];

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding
              component={item.path ? Link : 'div'}
              to={item.path}
              onClick={item.onClick || toggleDrawer(false)}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: item.color ? `${item.color}.main` : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ color: item.color ? `${item.color}.main` : 'inherit' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Navigation;