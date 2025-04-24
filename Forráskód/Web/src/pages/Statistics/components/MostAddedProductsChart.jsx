import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const MostAddedProductsChart = ({ stats }) => {
  const theme = useTheme();
  
  // Data for most added products bar chart
  const mostAddedProductsData = stats.mostAddedProducts.map(item => ({
    name: item.productName.length > 15 ? item.productName.slice(0, 15) + '...' : item.productName,
    count: item.count,
    fullName: item.productName
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'rgb(113, 189, 62)',
            p: 1.5,
            borderRadius: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            {payload[0].payload.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hozzáadva: {payload[0].value}x
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          color: theme.palette.text.primary,
          textAlign: 'center',
          mb: 3
        }}
      >
        Leggyakrabban Hozzáadott Termékek
      </Typography>
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mostAddedProductsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: 12 
              }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: 12 
              }}
              tickLine={{ stroke: theme.palette.divider }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill={theme.palette.primary.main}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default MostAddedProductsChart; 