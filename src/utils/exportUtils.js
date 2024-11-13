export const exportToCSV = (customers) => {
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Street Address',
      'Postcode',
      'City'
    ];
  
    // Map data fields to match headers
    const fields = [
      'firstname',
      'lastname',
      'email',
      'phone',
      'streetaddress',
      'postcode',
      'city'
    ];
  
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...customers.map(customer => 
        fields.map(field => 
          // Escape quotes and commas in the data
          `"${customer[field]?.replace(/"/g, '""') || ''}"`)
          .join(',')
      )
    ].join('\n');
  
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };