import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  CircularProgress, 
  Chip,
  IconButton, 
  Divider,
  Alert,
  Snackbar,
  useTheme,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

// Importáljuk a közös komponenseket
import Input from '../../common/Input';
import Button from '../../common/Button';
import Card from '../../common/Card';

// Importáljuk a szolgáltatásokat
import ProductCatalogService from '../../../services/productCatalog.service';

// Termékenkénti kártya komponens
const ProductCatalogItem = ({ product, onAddToList }) => {
  const theme = useTheme();
  
  return (
    <Card
      title={product.name}
      subheader={
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {product.category && (
            <Chip 
              label={product.category} 
              size="small" 
              color="primary" 
            />
          )}
          {product.tags && product.tags.map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small" 
              variant="outlined" 
              color="default" 
            />
          ))}
        </Box>
      }
      content={
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            {`Egység: ${product.unit || 'db'}`}
          </Typography>
          {product.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {product.description}
            </Typography>
          )}
        </Box>
      }
      actions={
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          size="small"
          onClick={() => onAddToList(product)}
          fullWidth
        >
          Hozzáadás a listához
        </Button>
      }
      sx={{
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    />
  );
};

const ProductCatalogBrowser = ({ onAddToList, selectedListId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const itemsPerPage = 9;
  const theme = useTheme();

  // Termékek betöltése
  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      let data;
      if (query.trim() === '') {
        // Ha nincs keresési kifejezés, az összes terméket betöltjük
        const response = await ProductCatalogService.getAllCatalogItems();
        data = response;
      } else {
        // Ha van keresési kifejezés, keresünk a termékek között
        const response = await ProductCatalogService.searchCatalogItems(query);
        data = response;
      }
      setProducts(data);
      setPage(1); // Visszaállítjuk az első oldalra
      setError(null);
    } catch (err) {
      setError(`Hiba a termékek betöltésekor: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Termékek betöltése az oldal betöltésekor
  useEffect(() => {
    fetchProducts();
  }, []);

  // Keresés kezelése debounce-olással
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Törölni a korábbi időzítőt
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Új időzítő beállítása
    const timeoutId = setTimeout(() => {
      fetchProducts(query);
    }, 500);
    
    setSearchTimeout(timeoutId);
  };

  // Oldal váltás kezelése
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Snackbar bezárásának kezelése
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Termék hozzáadásának kezelése
  const handleAddToList = (product) => {
    if (!selectedListId) {
      setSnackbar({
        open: true,
        message: 'Nincs kiválasztva lista! Kérjük, válasszon ki egy listát, amelyhez hozzá szeretné adni a terméket.',
        severity: 'warning'
      });
      return;
    }

    onAddToList(product);
    setSnackbar({
      open: true,
      message: `"${product.name}" sikeresen hozzáadva a listához!`,
      severity: 'success'
    });
  };

  // Pagináció számítása
  const paginatedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Kereső és szűrők */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Input
          placeholder="Termék keresése..."
          value={searchQuery}
          onChange={handleSearchChange}
          startIcon={<SearchIcon />}
          fullWidth
          sx={{ flexGrow: 1, minWidth: '250px' }}
        />
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FilterListIcon />}
        >
          Szűrés
        </Button>
      </Box>

      {/* Hibaüzenet */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Termékek listája */}
      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '300px'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {products.length === 0 ? (
            <Alert severity="info">
              Nem található termék a megadott keresési feltételekkel.
            </Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <ProductCatalogItem 
                      product={product} 
                      onAddToList={handleAddToList} 
                    />
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagináció */}
              {products.length > itemsPerPage && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mt: 4
                  }}
                >
                  <Pagination 
                    count={Math.ceil(products.length / itemsPerPage)} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* Snackbar értesítés */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductCatalogBrowser; 