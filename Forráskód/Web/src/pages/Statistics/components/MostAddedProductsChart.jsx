import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const MostAddedProductsChart = ({ stats }) => {
  const theme = useTheme();
  
  // Data for most added products bar chart
  const mostAddedProductsData = stats.mostAddedProducts.map(item => ({
    name: item.productName.length > 10 ? item.productName.slice(0, 10) + '...' : item.productName,
    count: item.count,
    fullName: item.productName
  }));

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Most Added Products</Typography>
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mostAddedProductsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
            <Bar dataKey="count" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MostAddedProductsChart; 