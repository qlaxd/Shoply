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
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Zoom,
  Fade,
  Card,
  CardHeader,
  CardContent,
  Rating,
  Collapse,
  Slide
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Importáljuk a közös komponenseket
import Button from '../../common/Button';

// Importáljuk a szolgáltatásokat
import ListService from '../../../services/list.service';
import ProductCatalogService from '../../../services/productCatalog.service';

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
  const [productDetails, setProductDetails] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // A termék adatok betöltése
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        quantity: product.quantity || 1,
        unit: product.unit || 'db',
        isPurchased: product.isPurchased || false
      });

      // Ha katalógus elem, lekérjük a részletes adatait
      if (product.catalogItem) {
        fetchCatalogItemDetails(product.catalogItem);
      }
    }
  }, [product]);

  // Katalógus elem részletes adatainak lekérése
  const fetchCatalogItemDetails = async (catalogItemId) => {
    setProductLoading(true);
    try {
      const catalogItem = await ProductCatalogService.getCatalogItemById(catalogItemId);
      setProductDetails(catalogItem);
    } catch (error) {
      console.error('Hiba a katalógus elem adatainak lekérésekor:', error);
    } finally {
      setProductLoading(false);
    }
  };

  // Mennyiség gombokkal történő változtatása
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, formData.quantity + amount);
    setFormData(prev => ({ ...prev, quantity: newQuantity }));
  };

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
        height: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Termék adatok betöltése...
        </Typography>
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
          mb: 2,
          flexDirection: isMedium ? 'column' : 'row',
          gap: isMedium ? 2 : 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              product.catalogItem ? 
                <Tooltip title="Katalógus termék">
                  <Avatar sx={{ width: 22, height: 22, bgcolor: theme.palette.secondary.light }}>
                    <VerifiedIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                </Tooltip> : null
            }
          >
            <Avatar 
              sx={{ 
                bgcolor: product.isPurchased ? theme.palette.success.main : theme.palette.primary.main,
                width: 50,
                height: 50,
                mr: 2,
                transition: 'all 0.3s ease'
              }}
            >
              {product.isPurchased ? <CheckCircleIcon /> : <ShoppingCartIcon />}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {formData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {productDetails?.category && (
                <Chip
                  icon={<CategoryIcon />}
                  label={productDetails.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              )}
              {formData.quantity} {formData.unit}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          {isEditing ? (
            <>
              <Zoom in={isEditing}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveChanges}
                  loading={loading}
                  disabled={loading}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Mentés
                </Button>
              </Zoom>
              <Zoom in={isEditing} style={{ transitionDelay: '100ms' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CloseIcon />}
                  onClick={handleToggleEdit}
                  disabled={loading}
                >
                  Mégse
                </Button>
              </Zoom>
            </>
          ) : (
            <>
              <Zoom in={!isEditing}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleToggleEdit}
                  disabled={loading}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Szerkesztés
                </Button>
              </Zoom>
              <Zoom in={!isEditing} style={{ transitionDelay: '100ms' }}>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteConfirmOpen}
                  disabled={loading}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Törlés
                </Button>
              </Zoom>
              {onClose && (
                <Zoom in={!isEditing} style={{ transitionDelay: '200ms' }}>
                  <IconButton 
                    onClick={onClose} 
                    color="default"
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'rotate(90deg)'
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Zoom>
              )}
            </>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Termék adatok */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
              }
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
              Termék adatok
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
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
                    autoFocus
                    sx={{
                      '& .MuiInput-root': {
                        transition: 'all 0.3s ease',
                        '&:after': {
                          borderBottomWidth: '2px'
                        }
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body1" fontWeight="medium" sx={{ mt: 1 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={formData.quantity <= 1}
                      sx={{ transition: 'all 0.2s ease' }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                      variant="standard"
                      inputProps={{ min: 1, step: 1 }}
                      sx={{ 
                        width: '60px', 
                        mx: 1,
                        '& input': { textAlign: 'center' },
                        '& .MuiInput-root': {
                          transition: 'all 0.3s ease',
                          '&:after': {
                            borderBottomWidth: '2px'
                          }
                        }
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(1)}
                      sx={{ transition: 'all 0.2s ease' }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="body1" fontWeight="medium" sx={{ mt: 1 }}>
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
                  <FormControl fullWidth variant="standard" sx={{ mt: 1 }}>
                    <Select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      disabled={!!product.catalogItem}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:after': {
                          borderBottomWidth: '2px'
                        }
                      }}
                    >
                      {units.map(unit => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1" fontWeight="medium" sx={{ mt: 1 }}>
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
              
              {/* Megvásárolva állapot */}
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    bgcolor: formData.isPurchased ? 'success.light' : 'background.default',
                    borderRadius: 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        name="isPurchased"
                        checked={formData.isPurchased}
                        onChange={handleChange}
                        color="success"
                        disabled={!isEditing && !formData.isPurchased}
                        sx={{ 
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            opacity: 0.7
                          },
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#fff'
                          }
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" fontWeight={formData.isPurchased ? '500' : 'normal'}>
                          {formData.isPurchased ? 'Megvásárolva' : 'Megvásárlásra vár'}
                        </Typography>
                        {formData.isPurchased && (
                          <CheckCircleIcon color="success" sx={{ ml: 1 }} />
                        )}
                      </Box>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Katalógus termék információk */}
        <Grid item xs={12} md={4}>
          {productLoading ? (
            <Paper sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
            </Paper>
          ) : productDetails ? (
            <Slide direction="left" in={!!productDetails} mountOnEnter unmountOnExit>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 0, 
                  overflow: 'hidden',
                  mb: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <InventoryIcon />
                      </Avatar>
                    }
                    title="Katalógus információk"
                    subheader={
                      <Chip 
                        label="Katalógusból" 
                        color="primary" 
                        size="small" 
                        icon={<VerifiedIcon />}
                        sx={{ mt: 1 }} 
                      />
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Divider sx={{ mb: 2 }} />
                    
                    {productDetails.category && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Kategória:
                        </Typography>
                        <Typography variant="body1">
                          {productDetails.category}
                        </Typography>
                      </Box>
                    )}
                    
                    {productDetails.description && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Leírás:
                        </Typography>
                        <Typography variant="body1">
                          {productDetails.description}
                        </Typography>
                      </Box>
                    )}
                    
                    {productDetails.popularity && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Népszerűség:
                        </Typography>
                        <Rating
                          value={productDetails.popularity / 20}
                          readOnly
                          precision={0.5}
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                      </Box>
                    )}
                    
                    {productDetails.tags && productDetails.tags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Címkék:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {productDetails.tags.map(tag => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Paper>
            </Slide>
          ) : product.catalogItem ? (
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Nem sikerült betölteni a katalógus adatokat.
              </Typography>
            </Paper>
          ) : null}
        </Grid>
      </Grid>
      
      {/* Törlés megerősítő dialógus */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Termék törlése
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Biztosan törölni szeretné a "<strong>{product.name}</strong>" terméket a listából? 
            Ez a művelet nem visszavonható.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleDeleteConfirmClose}
            variant="text"
          >
            Mégse
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            loading={loading}
            sx={{
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: theme.palette.error.dark
              }
            }}
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
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails; 