import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  TextField, 
  Box, 
  Typography, 
  Button, 
  Snackbar, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { customerService, trainingService } from '../services/api';
import CustomerDialog from './CustomerDialog';
import TrainingDialog from './TrainingDialog';
import DownloadIcon from '@mui/icons-material/Download';
import { exportToCSV } from '../utils/exportUtils';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [customerDialog, setCustomerDialog] = useState({ open: false, mode: 'add', data: null });
  const [trainingDialog, setTrainingDialog] = useState({ open: false, customer: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, customer: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'firstname', headerName: 'First Name', sortable: true, filter: true, flex: 1 },
    { field: 'lastname', headerName: 'Last Name', sortable: true, filter: true, flex: 1 },
    { field: 'email', headerName: 'Email', sortable: true, filter: true, flex: 1.5 },
    { field: 'phone', headerName: 'Phone', sortable: true, filter: true, flex: 1 },
    { field: 'streetaddress', headerName: 'Address', sortable: true, filter: true, flex: 1.5 },
    { field: 'postcode', headerName: 'Postcode', sortable: true, filter: true, flex: 1 },
    { field: 'city', headerName: 'City', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Actions',
      width: 180,
      cellRenderer: params => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditCustomer(params.data)}
            title="Edit customer"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleAddTraining(params.data)}
            title="Add training"
          >
            <FitnessCenterIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.data)}
            title="Delete customer"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      showSnackbar('Error fetching customers', 'error');
    }
  };

  const handleAddCustomer = () => {
    setCustomerDialog({ open: true, mode: 'add', data: null });
  };

  const handleEditCustomer = (customer) => {
    setCustomerDialog({ 
        open: true, 
        mode: 'edit', 
        data: {
          ...customer,
          _links: customer._links 
        }
      });
    };

  const handleAddTraining = (customer) => {
    setTrainingDialog({ open: true, customer });
  };

  const handleDeleteClick = (customer) => {
    setDeleteDialog({ 
      open: true, 
      customer,
      message: `Are you sure you want to delete ${customer.firstname} ${customer.lastname}? This will also delete all associated training sessions.`
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await customerService.deleteCustomer(deleteDialog.customer._links);
      await fetchCustomers();
      showSnackbar('Customer deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting customer', 'error');
    } finally {
      setDeleteDialog({ open: false, customer: null, message: '' });
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (customerDialog.mode === 'add') {
        await customerService.addCustomer(customerData);
        showSnackbar('Customer added successfully');
      } else {
        
        await customerService.updateCustomer(
          customerData,
          customerDialog.data._links
        );
        showSnackbar('Customer updated successfully');
      }
      await fetchCustomers();
      setCustomerDialog({ open: false, mode: 'add', data: null });
    } catch (error) {
      showSnackbar(`Error ${customerDialog.mode === 'add' ? 'adding' : 'updating'} customer`, 'error');
    }
  };

  const handleSaveTraining = async (trainingData, customerLinks) => {
    try {
      await trainingService.addTraining(trainingData, customerLinks);
      showSnackbar('Training added successfully');
      setTrainingDialog({ open: false, customer: null });
    } catch (error) {
      showSnackbar('Error adding training', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredCustomers = customers.filter(customer => 
    Object.values(customer)
      .filter(value => typeof value === 'string')
      .join(' ')
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );
  
  const handleExport = () => {
    exportToCSV(customers);
  };

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Customer List
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCustomer}
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search customers"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
        />
      </Box>

      <div className="ag-theme-material" style={{ height: 600 }}>
        <AgGridReact
          rowData={filteredCustomers}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          suppressCellFocus={true}
          defaultColDef={{
            resizable: true,
          }}
        />
      </div>

      <CustomerDialog
        open={customerDialog.open}
        onClose={() => setCustomerDialog({ open: false, mode: 'add', data: null })}
        customer={customerDialog.data}
        onSave={handleSaveCustomer}
        mode={customerDialog.mode}
      />

      <TrainingDialog
        open={trainingDialog.open}
        onClose={() => setTrainingDialog({ open: false, customer: null })}
        customer={trainingDialog.customer}
        onSave={handleSaveTraining}
      />

      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, customer: null, message: '' })}
      >
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          {deleteDialog.message}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, customer: null, message: '' })}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default CustomerList;