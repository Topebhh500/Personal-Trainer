/* eslint-disable react/prop-types */
// components/TrainingStats.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { groupBy, sumBy } from 'lodash';
import { trainingService } from '../services/api';

function TrainingStats() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingStats();
  }, []);

  const fetchTrainingStats = async () => {
    try {
      const trainings = await trainingService.getAllTrainings();
      
      // Group trainings by activity
      const groupedTrainings = groupBy(trainings, 'activity');
      
      // Calculate total duration for each activity
      const stats = Object.entries(groupedTrainings).map(([activity, sessions]) => ({
        activity,
        totalMinutes: sumBy(sessions, 'duration'),
        numberOfSessions: sessions.length
      }));

      // Sort by total duration descending
      const sortedStats = stats.sort((a, b) => b.totalMinutes - a.totalMinutes);
      
      setStatsData(sortedStats);
    } catch (error) {
      console.error('Error fetching training statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, backgroundColor: 'white' }}>
          <Typography variant="subtitle2" color="primary">
            {data.activity}
          </Typography>
          <Typography variant="body2">
            Total Duration: {data.totalMinutes.toLocaleString()} minutes
          </Typography>
          <Typography variant="body2">
            Number of Sessions: {data.numberOfSessions}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <div>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <BarChartIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Dashboard - Training Statistics
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                elevation={3}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TimelineIcon sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {statsData.length}
                      </Typography>
                      <Typography variant="subtitle1">
                        Activity Types
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card 
                elevation={3}
                sx={{ 
                  bgcolor: 'secondary.main',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {sumBy(statsData, 'totalMinutes').toLocaleString()}
                      </Typography>
                      <Typography variant="subtitle1">
                        Total Minutes
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card 
                elevation={3}
                sx={{ 
                  bgcolor: 'success.main',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FitnessCenterIcon sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" component="div">
                        {sumBy(statsData, 'numberOfSessions').toLocaleString()}
                      </Typography>
                      <Typography variant="subtitle1">
                        Total Sessions
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Minutes by Activity
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={statsData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e0e0e0"
                  />
                  <XAxis 
                    dataKey="activity" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fill: '#666666', fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Minutes', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#666666' }
                    }}
                    tick={{ fill: '#666666', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="totalMinutes" 
                    fill="#1976d2"
                    name="Total Minutes"
                    radius={[4, 4, 0, 0]}  // Rounded top corners
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </>
      )}
    </div>
  );
}

export default TrainingStats;