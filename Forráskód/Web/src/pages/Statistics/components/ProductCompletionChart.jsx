import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const ProductCompletionChart = ({ stats }) => {
  const theme = useTheme();
  
  const completionRateData = [
    { name: 'Megvett', value: stats.totalPurchasedProducts },
    { name: 'Nem megvett', value: stats.totalProducts - stats.totalPurchasedProducts }
  ];

  const COLORS = [theme.palette.success.main, theme.palette.grey[500]];

  const CustomTooltip = ({ active, payload }) => {
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
          <Typography variant="body2" color="text.primary">
            {payload[0].name}: {payload[0].value} termék
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
        Termékek Teljesítési Aránya
      </Typography>
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
              labelLine={false}
            >
              {completionRateData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <Box 
          display="flex" 
          justifyContent="center" 
          mt={2}
          sx={{
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          {completionRateData.map((entry, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              sx={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                p: 1,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  bgcolor: COLORS[index],
                  mr: 1, 
                  display: 'inline-block', 
                  borderRadius: '50%',
                  border: `2px solid ${theme.palette.background.paper}`
                }} 
              />
              <Typography variant="body2" color="text.secondary">
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductCompletionChart; 