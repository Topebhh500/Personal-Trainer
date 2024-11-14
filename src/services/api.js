const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';

export const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await fetch(`${BASE_URL}/customers`);
      const data = await response.json();
      return data._embedded?.customers || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  addCustomer: async (customer) => {
    try {
      const response = await fetch(`${BASE_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (!response.ok) throw new Error('Failed to add customer');
      return await response.json();
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  updateCustomer: async (customer, links) => {
    try {
      const response = await fetch(links.self.href, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (!response.ok) throw new Error('Failed to update customer');
      return await response.json();
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (links) => {
    try {
      const response = await fetch(links.self.href, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete customer');
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};

export const trainingService = {
    getAllTrainings: async () => {
      try {
        const response = await fetch(`${BASE_URL}/gettrainings`);
        if (!response.ok) throw new Error('Failed to fetch trainings');
        return await response.json();
      } catch (error) {
        console.error('Error fetching trainings:', error);
        throw error;
      }
    },
  
    addTraining: async (training, customerLinks) => {
      try {
        const formattedTraining = {
          date: training.date.toISOString(),
          duration: parseInt(training.duration),
          activity: training.activity,
          customer: customerLinks.self.href
        };
  
        const response = await fetch(`${BASE_URL}/trainings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedTraining)
        });
  
        if (!response.ok) {
          throw new Error('Failed to add training');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error adding training:', error);
        throw error;
      }
    },
  
    deleteTraining: async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/trainings/${id}`, { 
          method: 'DELETE' 
        });
        if (!response.ok) throw new Error('Failed to delete training');
      } catch (error) {
        console.error('Error deleting training:', error);
        throw error;
      }
    }
  };

  export const systemService = {
    resetDatabase: async () => {
      try {
        const response = await fetch(`${BASE_URL}/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to reset database');
        }
  
        const text = await response.text();
        console.log('Reset response:', text); // For debugging
        return text === 'DB reset done';
      } catch (error) {
        console.error('Error resetting database:', error);
        throw error;
      }
    }
  };