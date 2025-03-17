import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import StatisticsService from '../../services/statistics.service';
import StatisticsSummaryCards from './components/StatisticsSummaryCards';
import ProductCompletionChart from './components/ProductCompletionChart';
import MostAddedProductsChart from './components/MostAddedProductsChart';
import ListActivityStats from './components/ListActivityStats';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await StatisticsService.getUserPersonalStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">No statistics available</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" fontWeight="bold">
        Your Shopping Statistics
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Insights about your shopping habits and list management
      </Typography>

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
      <Box mt={4} textAlign="right">
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(stats.lastUpdated).toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default Statistics; 