import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';

const ListActivityStats = ({ stats }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>List Activity</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box textAlign="center" p={2}>
            <Typography variant="h5" color="primary" fontWeight="bold">{stats.activeLists}</Typography>
            <Typography variant="body1">Active Lists</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box textAlign="center" p={2}>
            <Typography variant="h5" color="success.main" fontWeight="bold">{stats.completedLists}</Typography>
            <Typography variant="body1">Completed Lists</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box textAlign="center" p={2}>
            <Typography variant="h5" color="info.main" fontWeight="bold">{stats.recentActivity.listsCreatedLast30Days}</Typography>
            <Typography variant="body1">Lists Created (30 days)</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ListActivityStats; 