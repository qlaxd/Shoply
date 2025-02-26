import React from 'react';
import { CircularProgress, Box, Typography, styled } from '@mui/material';
import PropTypes from 'prop-types';

const LoaderWrapper = styled(Box)(({ theme, size, fullPage }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ...(fullPage && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: theme.zIndex.modal,
  }),
  ...(!fullPage && {
    padding: theme.spacing(2),
  }),
}));

const Loader = ({
  size = 'medium',
  color = 'primary',
  thickness = 3.6,
  text,
  fullPage = false,
  ...rest
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 60;
      case 'medium':
      default:
        return 40;
    }
  };

  return (
    <LoaderWrapper size={size} fullPage={fullPage} {...rest}>
      <CircularProgress
        size={getSizeValue()}
        color={color}
        thickness={thickness}
      />
      {text && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {text}
        </Typography>
      )}
    </LoaderWrapper>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning', 'inherit']),
  thickness: PropTypes.number,
  text: PropTypes.string,
  fullPage: PropTypes.bool,
};

export default Loader; 