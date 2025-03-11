import React from 'react';
import { Typography, Box, Stack, styled } from '@mui/material';

const PageContentHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(2)
}));

/**
 * A custom header component that doesn't include breadcrumbs
 */
function CustomPageHeader(props) {
  const { title } = props;

  return (
    <Stack>
      <PageContentHeader>
        <Box>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
        </Box>
      </PageContentHeader>
    </Stack>
  );
}

export default CustomPageHeader; 