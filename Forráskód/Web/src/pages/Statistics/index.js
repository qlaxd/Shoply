import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, CircularProgress, useTheme } from '@mui/material';
import StatisticsService from '../../services/statistics.service';
import StatisticsSummaryCards from './components/StatisticsSummaryCards';
import ProductCompletionChart from './components/ProductCompletionChart';
import MostAddedProductsChart from './components/MostAddedProductsChart';
import ListActivityStats from './components/ListActivityStats';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await StatisticsService.getUserPersonalStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Nem sikerült betölteni a statisztikákat');
        console.error('Hiba a statisztikák betöltésekor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          backgroundColor: theme.palette.error.light,
          borderRadius: 2,
          p: 3
        }}
      >
        <Typography 
          color="error" 
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          p: 3
        }}
      >
        <Typography 
          variant="h6"
          sx={{
            textAlign: 'center',
            color: theme.palette.text.secondary
          }}
        >
          Nincs elérhető statisztika
        </Typography>
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
    >
      <Box 
        sx={{ 
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 2
          }}
        >
          A vásárlási szokásaid
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}
        >
          Egy átfogó betekintés a vásárlási szokásaidba és listáid kezelésébe
        </Typography>
      </Box>

      {/* Summary Cards */}
      <StatisticsSummaryCards stats={stats} />

      {/* Charts and Detailed Statistics */}
      <Grid container spacing={3}>
        {/* Product Completion Pie Chart */}
        <Grid item xs={12} md={6}>
          <ProductCompletionChart stats={stats} />
        </Grid>

        {/* Most Added Products Bar Chart */}
        <Grid item xs={12} md={6}>
          <MostAddedProductsChart stats={stats} />
        </Grid>

        {/* List Activity Stats */}
        <Grid item xs={12}>
          <ListActivityStats stats={stats} />
        </Grid>
      </Grid>

      {/* Last Updated */}
      <Box 
        mt={4} 
        textAlign="right"
        sx={{
          opacity: 0.7,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1
          }
        }}
      >
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{
            fontStyle: 'italic'
          }}
        >
          Utoljára frissítve: {new Date(stats.lastUpdated).toLocaleString('hu-HU')}
        </Typography>
      </Box>
    </Container>
  );
};

export default Statistics; 