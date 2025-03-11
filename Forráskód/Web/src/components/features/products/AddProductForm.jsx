import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  FormControl, 
  FormHelperText, 
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Alert,
  Autocomplete,
  CircularProgress,
  Checkbox,
  Chip
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';

// Importáljuk a közös komponenseket
import Button from '../../common/Button';
import Input from '../../common/Input';

// Importáljuk a szolgáltatásokat
import ListService from '../../../services/list.service';
import ProductCatalogService from '../../../services/productCatalog.service';

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

  // Katalógus adatok lekérése
  useEffect(() => {
    const fetchCatalogItems = async () => {
      setCatalogLoading(true);
      try {
        const data = await ProductCatalogService.getAllCatalogItems();
        setCatalogItems(data);
      } catch (err) {
        console.error('Hiba a katalógus adatok lekérésekor:', err);
        setError('Nem sikerült betölteni a termékkatalógust.');
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchCatalogItems();
  }, []);

  // Form adatok kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ShoppingBasketIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">
          Termék hozzáadása a listához
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          A termék sikeresen hozzáadva a listához!
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Katalógus termék választó */}
          <Grid item xs={12}>
            <Autocomplete
              id="catalogItem"
              options={catalogItems}
              getOptionLabel={(option) => option.name}
              loading={catalogLoading}
              onChange={handleCatalogItemChange}
              onInputChange={handleSearchInputChange}
              inputValue={searchTerm}
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
                        <InventoryIcon color="action" sx={{ mr: 1 }} />
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
                  helperText="Válasszon a katalógusból vagy adjon meg saját terméket"
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1">{option.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {option.category && (
                        <Chip
                          label={option.category}
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
              )}
              noOptionsText="Nincs találat"
              loadingText="Keresés..."
              fullWidth
            />
          </Grid>
          
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
              >
                {units.map(unit => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              loading={loading}
              fullWidth
            >
              Hozzáadás a listához
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProductForm; 