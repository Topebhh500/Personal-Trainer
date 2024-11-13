// components/TrainingDialog.jsx
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
      <DialogTitle>Add New Training for {customer?.firstname} {customer?.lastname}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <DateTimePicker
            label="Date and Time"
            value={formData.date}
            onChange={handleDateChange}
            slotProps={{ textField: { fullWidth: true } }}
          />
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
    </Dialog>
  );
}

export default TrainingDialog;