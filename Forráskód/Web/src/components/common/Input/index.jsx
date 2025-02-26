import React, { forwardRef } from 'react';
import { TextField, InputAdornment, styled } from '@mui/material';
import PropTypes from 'prop-types';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      fontWeight: 500,
    },
  },
}));

const Input = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  type = 'text',
  placeholder,
  startIcon,
  endIcon,
  multiline = false,
  rows = 1,
  fullWidth = true,
  disabled = false,
  required = false,
  autoFocus = false,
  size = 'medium',
  variant = 'outlined',
  ...rest
}, ref) => {
  
  return (
    <StyledTextField
      id={id}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      error={!!error}
      helperText={error || helperText}
      type={type}
      placeholder={placeholder}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : null,
      }}
      multiline={multiline}
      rows={rows}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
      size={size}
      variant={variant}
      inputRef={ref}
      {...rest}
    />
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
};

export default Input; 