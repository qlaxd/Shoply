import React from 'react';
import { Grid, Paper, Box, Typography, useTheme } from '@mui/material';
import {
  PlaylistAdd as ActiveIcon,
  CheckCircle as CompletedIcon,
  TrendingUp as RecentIcon
} from '@mui/icons-material';

const ListActivityStats = ({ stats }) => {
  const theme = useTheme();

  const activityData = [
    {
      icon: <ActiveIcon sx={{ fontSize: 40 }} />,
      value: stats.activeLists,
      label: "Aktív Listák",
      color: theme.palette.primary.main
    },
    {
      icon: <CompletedIcon sx={{ fontSize: 40 }} />,
      value: stats.completedLists,
      label: "Befejezett Listák",
      color: theme.palette.success.main
    },
    {
      icon: <RecentIcon sx={{ fontSize: 40 }} />,
      value: stats.recentActivity.listsCreatedLast30Days,
      label: "Új Listák (30 nap)",
      color: theme.palette.info.main
    }
  ];

  return (
    <Paper 
      sx={{ 
        p: 3,
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
          textAlign: 'center',
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 3
        }}
      >
        Lista Aktivitás
      </Typography>
      <Grid container spacing={3}>
        {activityData.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                backgroundColor: `${item.color}10`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: `${item.color}20`,
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Box 
                sx={{ 
                  color: item.color,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {item.icon}
              </Box>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  color: item.color,
                  mb: 1
                }}
              >
                {item.value}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  textAlign: 'center'
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ListActivityStats; 