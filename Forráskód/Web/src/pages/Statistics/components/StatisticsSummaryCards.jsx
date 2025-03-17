import React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  List as ListIcon,
  ShoppingCart as ShoppingCartIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const StatisticsSummaryCards = ({ stats }) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <ListIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Lists</Typography>
            </Box>
            <Typography variant="h3" component="div" align="center" fontWeight="bold">
              {stats.totalOwnedLists}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} align="center">
              Personal shopping lists
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <ShareIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Shared Lists</Typography>
            </Box>
            <Typography variant="h3" component="div" align="center" fontWeight="bold">
              {stats.totalSharedLists}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} align="center">
              Collaborative shopping
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Completion</Typography>
            </Box>
            <Typography variant="h3" component="div" align="center" fontWeight="bold">
              {Math.round(stats.productCompletionRate)}%
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} align="center">
              Products purchased
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <ShoppingCartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Products</Typography>
            </Box>
            <Typography variant="h3" component="div" align="center" fontWeight="bold">
              {stats.totalProducts}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} align="center">
              Total items added
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatisticsSummaryCards; 