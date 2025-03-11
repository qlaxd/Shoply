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
  Pagination,
  InputAdornment,
  useMediaQuery
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      actions={
        <Button
          variant="contained"
          color="primary"
          size={isMobile ? "small" : "medium"}
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAddToList(product)}
          fullWidth={isMobile}
          sx={{ mt: isMobile ? 1 : 0 }}
        >
          Hozzáadás
        </Button>
      }
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      contentProps={{
        sx: { flexGrow: 1 }
      }}
    >
      <Box sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {product.description || 'Nincs leírás'}
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          <strong>Mértékegység:</strong> {product.defaultUnit || 'db'}
        </Typography>
      </Box>
    </Card>
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const itemsPerPage = isMobile ? 6 : 9;

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
    
    // Töröljük az előző időzítőt, ha van
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Új időzítő beállítása a kereséssel
    const timeoutId = setTimeout(() => {
      fetchProducts(query);
    }, 500); // 500ms késleltetés a kereséshez
    
    setSearchTimeout(timeoutId);
  };

  // Lapozás kezelése
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Snackbar bezárásának kezelése
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Termék hozzáadásának kezelése
  const handleAddToList = (product) => {
    if (!selectedListId) {
      setSnackbar({
        open: true,
        message: 'Nincs kiválasztva bevásárlólista!',
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
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Input
          placeholder="Termék keresése..."
          value={searchQuery}
          onChange={handleSearchChange}
          startIcon={<SearchIcon />}
          fullWidth
          sx={{ flexGrow: 1, minWidth: '100%' }}
        />
        
        <Box sx={{ 
          display: 'flex', 
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-end', sm: 'flex-start' }
        }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            sx={{ minWidth: isSmallMobile ? '100%' : 'auto' }}
          >
            Szűrés
          </Button>
        </Box>
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
              <Grid container spacing={2}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id} sx={{ display: 'flex' }}>
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
                    mt: 4,
                    pb: 2
                  }}
                >
                  <Pagination 
                    count={Math.ceil(products.length / itemsPerPage)} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    siblingCount={isMobile ? 0 : 1}
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