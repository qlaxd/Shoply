import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Grid, 
  Paper, 
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Tooltip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

// Importáljuk a közös komponenseket
import Button from '../../common/Button';

// Importáljuk a szolgáltatásokat
import ListService from '../../../services/list.service';

const units = ['db', 'kg', 'g', 'l', 'ml', 'csomag', 'üveg', 'doboz'];

const ProductDetails = ({ product, listId, onUpdate, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'db',
    isPurchased: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // A termék adatok betöltése
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        quantity: product.quantity || 1,
        unit: product.unit || 'db',
        isPurchased: product.isPurchased || false
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'isPurchased' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Csak a módosítható mezőket küldjük el
      const updateData = {
        quantity: formData.quantity,
        isPurchased: formData.isPurchased
      };
      
      // Ha a termék nincs katalógusból, akkor módosíthatjuk a nevét és egységét
      if (!product.catalogItem) {
        updateData.name = formData.name;
        updateData.unit = formData.unit;
      }
      
      await ListService.updateProductInList(listId, product._id, updateData);
      
      setSnackbar({
        open: true,
        message: 'A termék sikeresen frissítve!',
        severity: 'success'
      });
      
      setIsEditing(false);
      
      // Callback a szülő komponensnek
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Hiba a termék frissítésekor: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await ListService.removeProductFromList(listId, product._id);
      
      setSnackbar({
        open: true,
        message: 'A termék sikeresen törölve!',
        severity: 'success'
      });
      
      // Callback a szülő komponensnek
      if (onDelete) {
        onDelete();
      }
      
      // Bezárjuk a dialógust
      handleDeleteConfirmClose();
      
      // Bezárjuk a részletek ablakot
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Hiba a termék törlésekor: ${error.message}`,
        severity: 'error'
      });
      handleDeleteConfirmClose();
    } finally {
      setLoading(false);
    }
  };

  // Snackbar bezárása
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!product) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '400px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Fejléc */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}
      >
        <Typography variant="h5">
          Termék részletek
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isEditing ? (
            <>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveChanges}
                loading={loading}
                disabled={loading}
              >
                Mentés
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<CloseIcon />}
                onClick={handleToggleEdit}
                disabled={loading}
              >
                Mégse
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleToggleEdit}
                disabled={loading}
              >
                Szerkesztés
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteConfirmOpen}
                disabled={loading}
              >
                Törlés
              </Button>
              {onClose && (
                <IconButton onClick={onClose} color="default">
                  <CloseIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Termék adatok */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Név */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Termék neve:
            </Typography>
            {isEditing && !product.catalogItem ? (
              <TextField
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="standard"
                disabled={!!product.catalogItem}
              />
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formData.name}
                {product.catalogItem && (
                  <Tooltip title="Katalógus termék, a neve nem módosítható">
                    <InfoIcon 
                      color="info" 
                      sx={{ fontSize: '1rem', ml: 1, verticalAlign: 'middle' }} 
                    />
                  </Tooltip>
                )}
              </Typography>
            )}
          </Grid>
          
          {/* Mennyiség */}
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Mennyiség:
            </Typography>
            {isEditing ? (
              <TextField
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                variant="standard"
                inputProps={{ min: 1, step: 1 }}
              />
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formData.quantity}
              </Typography>
            )}
          </Grid>
          
          {/* Egység */}
          <Grid item xs={6} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Egység:
            </Typography>
            {isEditing && !product.catalogItem ? (
              <FormControl fullWidth variant="standard">
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={!!product.catalogItem}
                >
                  {units.map(unit => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" fontWeight="medium">
                {formData.unit}
                {product.catalogItem && (
                  <Tooltip title="Katalógus termék, az egysége nem módosítható">
                    <InfoIcon 
                      color="info" 
                      sx={{ fontSize: '1rem', ml: 1, verticalAlign: 'middle' }} 
                    />
                  </Tooltip>
                )}
              </Typography>
            )}
          </Grid>
          
          {/* További adatok */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          {/* Megvásárolva állapot */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="isPurchased"
                  checked={formData.isPurchased}
                  onChange={handleChange}
                  color="success"
                  disabled={!isEditing && !formData.isPurchased}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {formData.isPurchased ? 'Megvásárolva' : 'Megvásárlásra vár'}
                  </Typography>
                  {formData.isPurchased && (
                    <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
            />
          </Grid>
          
          {/* Katalógus információk */}
          {product.catalogItem && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Katalógus termék:
                </Typography>
                <Chip 
                  label="Katalógusból" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Törlés megerősítő dialógus */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
      >
        <DialogTitle>
          Termék törlése
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Biztosan törölni szeretné a "{product.name}" terméket a listából? 
            Ez a művelet nem visszavonható.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>
            Mégse
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            loading={loading}
          >
            Törlés
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar értesítések */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails; 