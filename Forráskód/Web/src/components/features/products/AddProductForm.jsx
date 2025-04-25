import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Autocomplete,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  InputAdornment,
  ButtonGroup,
  IconButton,
  Collapse,
  Grow
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

// Importáljuk a közös komponenseket
import Button from '../../common/Button';

// Importáljuk a szolgáltatásokat
import ListService from '../../../services/list.service';
import ProductCatalogService from '../../../services/productCatalog.service';
import CategoryService from '../../../services/category.service';

const units = ['db', 'kg', 'g', 'l', 'ml', 'csomag', 'üveg', 'doboz'];

const AddProductForm = ({ listId, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'db',
    catalogItem: null,
    fromCatalog: false
  });
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [catalogItems, setCatalogItems] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [suggestionCount, setSuggestionCount] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Katalógus adatok és kategóriák lekérése
  useEffect(() => {
    const fetchInitialData = async () => {
      setCatalogLoading(true);
      try {
        const [catalogData, categoryData] = await Promise.all([
          ProductCatalogService.getAllCatalogItems(),
          CategoryService.getAllCategories()
        ]);
        
        setCatalogItems(catalogData);
        setCategories(categoryData);
        setSuggestionCount(Math.min(catalogData.length, 1000));
      } catch (err) {
        console.error('Hiba az adatok lekérésekor:', err);
        setError('Nem sikerült betölteni a szükséges adatokat.');
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Form adatok kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mennyiség gombokkal történő változtatása
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, formData.quantity + amount);
    setFormData(prev => ({ ...prev, quantity: newQuantity }));
  };

  // Katalógus termék kiválasztása
  const handleCatalogItemChange = (event, newValue) => {
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        catalogItem: newValue._id,
        name: newValue.name,
        unit: newValue.unit || 'db',
        fromCatalog: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        catalogItem: null,
        fromCatalog: false
      }));
    }
  };

  // Katalógus keresés
  const handleSearchInputChange = (event, value) => {
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeoutId = setTimeout(async () => {
      if (value && value.length > 2) {
        setCatalogLoading(true);
        try {
          const results = await ProductCatalogService.searchCatalogItems(value);
          setCatalogItems(results);
          setSuggestionCount(results.length);
        } catch (err) {
          console.error('Hiba a katalógus keresés során:', err);
        } finally {
          setCatalogLoading(false);
        }
      }
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  // Form beküldése
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    if (!formData.name.trim()) {
      setError('A termék neve nem lehet üres!');
      setLoading(false);
      return;
    }
    
    const productData = {
      name: formData.name,
      quantity: formData.quantity,
      unit: formData.unit
    };
    
    if (formData.catalogItem) {
      productData.catalogItem = formData.catalogItem;
    }
    
    try {
      await ListService.addProductToList(listId, productData);
      setSuccess(true);
      
      // Form reset
      setFormData({
        name: '',
        quantity: 1,
        unit: 'db',
        catalogItem: null,
        fromCatalog: false
      });
      setSearchTerm('');
      
      // Callback
      if (onAddSuccess) {
        onAddSuccess();
      }
    } catch (err) {
      setError(`Hiba a termék hozzáadásakor: ${err.message}`);
    } finally {
      setLoading(false);
      
      // Sikeres hozzáadás után 3 másodperc múlva eltüntetjük a sikeres üzenetet
      if (success) {
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    }
  };

  // Űrlap reset
  const handleReset = () => {
    setFormData({
      name: '',
      quantity: 1,
      unit: 'db',
      catalogItem: null,
      fromCatalog: false
    });
    setSearchTerm('');
    setError(null);
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 1
      }}>
        <ShoppingBasketIcon 
          color="primary" 
          sx={{ 
            mr: 1,
            fontSize: '1.8rem',
            animation: success ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.2)' },
              '100%': { transform: 'scale(1)' }
            }
          }} 
        />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Termék hozzáadása a listához
        </Typography>
      </Box>
      
      <Collapse in={Boolean(error)} timeout={300}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <ClearIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>
      
      <Collapse in={success} timeout={300}>
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          icon={<CheckCircleIcon fontSize="inherit" />}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setSuccess(false)}
            >
              <ClearIcon fontSize="inherit" />
            </IconButton>
          }
        >
          A termék sikeresen hozzáadva a listához!
        </Alert>
      </Collapse>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Katalógus termék választó */}
          <Grid item xs={12}>
            <Autocomplete
              id="catalogItem"
              options={catalogItems}
              getOptionLabel={(option) => option.name}
              value={formData.catalogItem ? catalogItems.find(item => item._id === formData.catalogItem) || null : null}
              loading={catalogLoading}
              onChange={handleCatalogItemChange}
              onInputChange={handleSearchInputChange}
              inputValue={searchTerm}
              filterOptions={(x) => x}
              clearOnBlur={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Keresés a katalógusban"
                  variant="outlined"
                  placeholder="Kezdje el beírni a termék nevét..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon color="action" sx={{ mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: (
                      <>
                        {catalogLoading ? (
                          <CircularProgress size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                  helperText={
                    <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>Válasszon a katalógusból vagy adjon meg saját terméket</span>
                      {suggestionCount > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'rgb(61, 210, 44)' }}>
                          {suggestionCount} találat
                        </span>
                      )}
                    </span>
                  }
                  fullWidth
                />
              )}
              renderOption={(props, option, { selected }) => (
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} key={option._id}>
                  <li {...props}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      width: '100%',
                      py: 0.5
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body1" fontWeight={selected ? 'bold' : 'normal'}>
                          {option.name}
                        </Typography>
                        {selected && (
                          <CheckCircleIcon color="success" fontSize="small" sx={{ ml: 'auto' }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        {option.category && (
                          <Chip
                            label={categories.find(cat => cat._id === option.category)?.name || option.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {option.unit || 'db'}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                </Grow>
              )}
              noOptionsText="Nincs találat"
              loadingText="Keresés..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s ease',
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Termék neve"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                disabled={formData.fromCatalog}
                InputProps={{
                  startAdornment: formData.fromCatalog && (
                    <InputAdornment position="start">
                      <Tooltip title="Katalógus termék - a név nem módosítható">
                        <InventoryIcon color="primary" fontSize="small" />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <TextField
                name="quantity"
                label="Mennyiség"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 1, step: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ButtonGroup size="small" orientation="vertical" variant="outlined">
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(1)}
                          sx={{ height: '18px' }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(-1)}
                          disabled={formData.quantity <= 1}
                          sx={{ height: '18px' }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </ButtonGroup>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="unit-label">Egység</InputLabel>
                <Select
                  labelId="unit-label"
                  name="unit"
                  value={formData.unit}
                  label="Egység"
                  onChange={handleChange}
                  disabled={formData.fromCatalog}
                  startAdornment={formData.fromCatalog && (
                    <InputAdornment position="start">
                      <Tooltip title="Katalógus termék - az egység nem módosítható">
                        <InfoOutlinedIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                      </Tooltip>
                    </InputAdornment>
                  )}
                  sx={{
                    height: '56px',
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
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
            </Grid>
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: isMobile ? 'center' : 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              startIcon={<ClearIcon />}
              disabled={loading}
              sx={{ 
                minWidth: isMobile ? '45%' : 'auto',
                transition: 'all 0.2s ease'
              }}
            >
              Törlés
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              loading={loading}
              fullWidth={isMobile}
              sx={{ 
                minWidth: isMobile ? '45%' : 'auto',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 16px rgba(63, 81, 181, 0.2)`
                }
              }}
            >
              Hozzáadás
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProductForm; 