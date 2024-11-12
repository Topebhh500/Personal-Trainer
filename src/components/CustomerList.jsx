import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { TextField, Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filterText, setFilterText] = useState('');

  const columns = [
    { field: 'firstname', headerName: 'First Name', sortable: true, filter: true },
    { field: 'lastname', headerName: 'Last Name', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true },
    { field: 'phone', headerName: 'Phone', sortable: true, filter: true },
    { field: 'streetaddress', headerName: 'Address', sortable: true, filter: true },
    { field: 'postcode', headerName: 'Postcode', sortable: true, filter: true },
    { field: 'city', headerName: 'City', sortable: true, filter: true }
  ];

  const fetchCustomers = useCallback(() => {
    fetch('/api/customers')
      .then(response => response.json())
      .then(data => {
        if (data._embedded && data._embedded.customers) {
          setCustomers(data._embedded.customers);
        }
      })
      .catch(err => console.error('Error fetching customers:', err));
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const onFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const filteredCustomers = customers.filter(customer => 
    Object.values(customer)
      .filter(value => typeof value === 'string')
      .join(' ')
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}> 
        <PeopleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
            Customer List
        </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
            <TextField
            label="Search customers"
            variant="outlined"
            value={filterText}
            onChange={onFilterTextChange}
            fullWidth
            />
        </Box>
        <div className="ag-theme-material" style={{ height: 600 }}>
            <AgGridReact
            rowData={filteredCustomers}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            />
        </div>
    </div>
  );
}

export default CustomerList;