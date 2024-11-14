// components/TrainingDialog.jsx
import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function TrainingDialog({ open, onClose, customer, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date(),
    activity: '',
    duration: ''
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        date: new Date(),
        activity: '',
        duration: ''
      });
    }
  }, [open]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleDateChange = (newDate) => {
    if (newDate) {
      setFormData({
        ...formData,
        date: newDate
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData, customer._links);
  };

  if (!customer) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>Add New Training for {customer.firstname} {customer.lastname}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Date and Time"
              value={formData.date}
              onChange={handleDateChange}
              textField={(params) => (
                <TextField {...params} fullWidth required />
              )}
              views={['year', 'month', 'day', 'hours', 'minutes']}
              format="dd.MM.yyyy HH:mm"
            />
          </LocalizationProvider>
          <TextField
            name="activity"
            label="Activity"
            value={formData.activity}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="duration"
            label="Duration (minutes)"
            value={formData.duration}
            onChange={handleChange}
            required
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit" 
          variant="contained"
          disabled={!formData.date || !formData.activity || !formData.duration}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TrainingDialog;