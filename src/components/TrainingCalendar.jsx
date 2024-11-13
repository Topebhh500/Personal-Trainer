import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { trainingService } from '../services/api';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function TrainingCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [view, setView] = useState('month');

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const data = await trainingService.getAllTrainings();
      // Transform training data for calendar
      const events = data.map(training => ({
        id: training.id,
        title: `${training.activity} - ${training.customer.firstname} ${training.customer.lastname}`,
        start: new Date(training.date),
        end: new Date(new Date(training.date).getTime() + training.duration * 60000), // duration in minutes
        resource: training
      }));
      setTrainings(events);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#1976d2',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0',
        display: 'block'
      }
    };
  };

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Training Calendar
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="calendar view"
        >
          <ToggleButton value="month" aria-label="month view">
            Month
          </ToggleButton>
          <ToggleButton value="week" aria-label="week view">
            Week
          </ToggleButton>
          <ToggleButton value="day" aria-label="day view">
            Day
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper sx={{ height: 'calc(100vh - 200px)', p: 2 }}>
        <Calendar
          localizer={localizer}
          events={trainings}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={event => `${event.title}\nDuration: ${event.resource.duration} minutes`}
          popup
        />
      </Paper>
    </div>
  );
}

export default TrainingCalendar;