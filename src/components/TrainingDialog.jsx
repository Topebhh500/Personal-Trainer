import { useState } from 'react';
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
    duration: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData, customer._links);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Training for {customer?.firstname} {customer?.lastname}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Date and Time"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} required fullWidth />}
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
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TrainingDialog;