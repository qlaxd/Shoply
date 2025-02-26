import React from 'react';
import { Button as MuiButton, styled } from '@mui/material';
import PropTypes from 'prop-types';

const StyledButton = styled(MuiButton)(({ theme, size, variant, color }) => ({
  borderRadius: '4px',
  textTransform: 'none',
  fontWeight: 600,
  ...(size === 'small' && {
    padding: '6px 16px',
    fontSize: '0.875rem',
  }),
  ...(size === 'medium' && {
    padding: '8px 20px',
    fontSize: '0.975rem',
  }),
  ...(size === 'large' && {
    padding: '10px 24px',
    fontSize: '1rem',
  }),
}));

const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  type = 'button',
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button; 