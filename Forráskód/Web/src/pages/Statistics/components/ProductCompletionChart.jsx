import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const ProductCompletionChart = ({ stats }) => {
  const theme = useTheme();
  
  // Data for completion rate pie chart
  const completionRateData = [
    { name: 'Purchased', value: stats.totalPurchasedProducts },
    { name: 'Not Purchased', value: stats.totalProducts - stats.totalPurchasedProducts }
  ];
  const COLORS = [theme.palette.success.main, theme.palette.grey[300]];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Product Completion Rate</Typography>
      <Box height={300} display="flex" flexDirection="column" justifyContent="center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={completionRateData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {completionRateData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} products`, `${completionRateData[0].name}`]} />
          </PieChart>
        </ResponsiveContainer>
        <Box display="flex" justifyContent="center" mt={2}>
          <Box display="flex" alignItems="center" mr={3}>
            <Box component="span" sx={{ width: 12, height: 12, bgcolor: COLORS[0], mr: 1, display: 'inline-block', borderRadius: '50%' }} />
            <Typography variant="body2">Purchased: {stats.totalPurchasedProducts}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Box component="span" sx={{ width: 12, height: 12, bgcolor: COLORS[1], mr: 1, display: 'inline-block', borderRadius: '50%' }} />
            <Typography variant="body2">Not Purchased: {stats.totalProducts - stats.totalPurchasedProducts}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductCompletionChart; 