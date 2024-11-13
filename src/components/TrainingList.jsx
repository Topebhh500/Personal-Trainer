import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
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
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { trainingService } from '../services/api';

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, training: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      sortable: true, 
      filter: true,
      flex: 1,
      valueFormatter: params => 
        format(new Date(params.value), 'dd.MM.yyyy HH:mm')
    },
    { 
      field: 'duration', 
      headerName: 'Duration (min)', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      field: 'activity', 
      headerName: 'Activity', 
      sortable: true, 
      filter: true,
      flex: 1
    },
    { 
      field: 'customer', 
      headerName: 'Customer', 
      sortable: true, 
      filter: true,
      flex: 1,
      valueGetter: params => {
        if (params.data.customer) {
          return `${params.data.customer.firstname} ${params.data.customer.lastname}`;
        }
        return '';
      }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: params => (
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteClick(params.data)}
          title="Delete training"
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await trainingService.getAllTrainings();
      setTrainings(data);
    } catch (error) {
      showSnackbar('Error fetching trainings', 'error');
    }
  };

  const handleDeleteClick = (training) => {
    setDeleteDialog({ 
      open: true, 
      training,
      message: `Are you sure you want to delete this training session?`
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await trainingService.deleteTraining(deleteDialog.training.id);
      await fetchTrainings();
      showSnackbar('Training deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting training', 'error');
    } finally {
      setDeleteDialog({ open: false, training: null });
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredTrainings = trainings.filter(training => {
    const searchString = [
      format(new Date(training.date), 'dd.MM.yyyy HH:mm'),
      training.activity,
      training.duration?.toString(),
      training.customer?.firstname,
      training.customer?.lastname
    ].join(' ').toLowerCase();
    
    return searchString.includes(filterText.toLowerCase());
  });

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FitnessCenterIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Training Sessions
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search trainings"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
        />
      </Box>

      <div className="ag-theme-material" style={{ height: 600 }}>
        <AgGridReact
          rowData={filteredTrainings}
          columnDefs={columns}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          animateRows={true}
          suppressCellFocus={true}
          defaultColDef={{
            resizable: true,
            suppressMovable: true
          }}
        />
      </div>

      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, training: null })}
      >
        <DialogTitle>Delete Training Session</DialogTitle>
        <DialogContent>
          {deleteDialog.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, training: null })}>
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

export default TrainingList;