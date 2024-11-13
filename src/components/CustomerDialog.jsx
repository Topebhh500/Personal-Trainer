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

function CustomerDialog({ open, onClose, customer, onSave, mode = 'add' }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  // Reset form data when customer or mode changes
  useEffect(() => {
    if (mode === 'edit' && customer) {
      setFormData({
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
        email: customer.email || '',
        phone: customer.phone || '',
        streetaddress: customer.streetaddress || '',
        postcode: customer.postcode || '',
        city: customer.city || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: ''
      });
    }
  }, [customer, mode]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
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
      <DialogTitle>
        {mode === 'add' ? 'Add New Customer' : `Edit Customer: ${customer?.firstname} ${customer?.lastname}`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            name="firstname"
            label="First Name"
            value={formData.firstname}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="lastname"
            label="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            type="email"
          />
          <TextField
            name="phone"
            label="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="streetaddress"
            label="Street Address"
            value={formData.streetaddress}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="postcode"
            label="Postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="city"
            label="City"
            value={formData.city}
            onChange={handleChange}
            required
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {mode === 'add' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerDialog;