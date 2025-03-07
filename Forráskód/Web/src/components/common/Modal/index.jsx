import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
}));

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  disableBackdropClick = false,
  hideCloseButton = false,
  ...rest
}) => {
  const theme = useTheme();
  const fullScreenBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const isFullScreen = fullScreen || fullScreenBreakpoint;

  const handleBackdropClick = (event) => {
    if (!disableBackdropClick) {
      onClose?.(event, 'backdropClick');
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={isFullScreen}
      onBackdropClick={handleBackdropClick}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...rest}
    >
      {title && (
        <>
          <StyledDialogTitle id="modal-title">
            <Typography variant="h6" component="div">
              Bevásárlólista
            </Typography>
            {!hideCloseButton && (
              <IconButton
                aria-label="bezárás"
                onClick={onClose}
                size="small"
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            )}
          </StyledDialogTitle>
          <Divider />
        </>
      )}

      <DialogContent>
        {description && (
          <DialogContentText id="modal-description" gutterBottom>
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>

      {actions && (
        <>
          <Divider />
          <DialogActions sx={{ padding: (theme) => theme.spacing(1.5, 3) }}>
            <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>
          </DialogActions>
        </>
      )}
    </StyledDialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.node,
  description: PropTypes.node,
  children: PropTypes.node,
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  fullWidth: PropTypes.bool,
  fullScreen: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  hideCloseButton: PropTypes.bool,
};

export default Modal; 