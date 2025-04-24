import React from 'react';
import { Grid, Card, CardContent, Box, Typography, useTheme } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  List as ListIcon,
  ShoppingCart as ShoppingCartIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const StatisticsSummaryCards = ({ stats }) => {
  const theme = useTheme();

  const cardData = [
    {
      icon: <ListIcon sx={{ fontSize: 40 }} />,
      title: "Összes Lista",
      value: stats.totalOwnedLists,
      subtitle: "Személyes bevásárlólisták",
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40 }} />,
      title: "Megosztott Listák",
      value: stats.totalSharedLists,
      subtitle: "Közös bevásárlások",
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      title: "Teljesítés",
      value: `${Math.round(stats.productCompletionRate)}%`,
      subtitle: "Megvásárolt termékek",
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: "Termékek",
      value: stats.totalProducts,
      subtitle: "Összes hozzáadott tétel",
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.main} 100%)`
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: '100%',
              background: card.gradient,
              borderRadius: 3,
              boxShadow: `0 8px 24px 0 ${card.color}33`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 12px 28px 0 ${card.color}40`
              }
            }}
          >
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                color="white"
              >
                <Box mb={2}>
                  {React.cloneElement(card.icon, {
                    sx: { fontSize: 40, mb: 1, opacity: 0.9 }
                  })}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    textAlign: 'center',
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    opacity: 0.9,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {card.subtitle}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsSummaryCards; 