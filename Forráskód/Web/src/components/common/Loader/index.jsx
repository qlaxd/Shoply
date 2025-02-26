import { CircularProgress, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

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

  // A fullPage prop alapján határozzuk meg a stílusokat, és nem adjuk tovább a DOM-nak
  const fullPageStyle = fullPage ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1300, // theme.zIndex.modal értéke általában 1300
  } : {};

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: fullPage ? 0 : 2,
    ...fullPageStyle
  };

  return (
    <Box sx={containerStyle} {...rest}>
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
    </Box>
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