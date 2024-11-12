import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { TextField, Box, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { format } from 'date-fns';

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [filterText, setFilterText] = useState('');

  const columns = [
    { 
      field: 'date', 
      headerName: 'Date', 
      sortable: true, 
      filter: true,
      valueFormatter: params => 
        format(new Date(params.value), 'dd.MM.yyyy HH:mm')
    },
    { field: 'duration', headerName: 'Duration (min)', sortable: true, filter: true },
    { field: 'activity', headerName: 'Activity', sortable: true, filter: true },
    { 
      field: 'customer', 
      headerName: 'Customer', 
      sortable: true, 
      filter: true,
      valueGetter: params => {
        if (params.data.customer) {
          return `${params.data.customer.firstname} ${params.data.customer.lastname}`;
        }
        return '';
      }
    }
  ];

  const fetchTrainings = useCallback(() => {
    fetch('/api/gettrainings')
      .then(response => response.json())
      .then(data => {
        setTrainings(data);
      })
      .catch(err => console.error('Error fetching trainings:', err));
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const onFilterTextChange = (event) => {
    setFilterText(event.target.value);
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
            onChange={onFilterTextChange}
            fullWidth
            />
        </Box>
        <div className="ag-theme-material" style={{ height: 600 }}> 
            <AgGridReact
            rowData={filteredTrainings}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            />
        </div>
    </div>
  );
}

export default TrainingList;