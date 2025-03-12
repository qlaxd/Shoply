import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  CircularProgress, 
  Chip,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  Pagination,
  useMediaQuery,
  Fade,
  Grow,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SortIcon from '@mui/icons-material/Sort';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlphabetIcon from '@mui/icons-material/SortByAlpha';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Importáljuk a közös komponenseket
import Input from '../../common/Input';
import Button from '../../common/Button';
import Card from '../../common/Card';

// Importáljuk a szolgáltatásokat
import ProductCatalogService from '../../../services/productCatalog.service';
import CategoryService from '../../../services/category.service';

// Termékenkénti kártya komponens
const ProductCatalogItem = ({ product, onAddToList, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grow
      in={true}
      style={{ transformOrigin: '0 0 0' }}
      timeout={300 + (index * 50)}
    >
      <div style={{ height: '100%', width: '100%' }}>
        <Card
          title={product.name}
          subheader={
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {product.category && (
                <Chip 
                  label={product.category} 
                  size="small" 
                  color="primary" 
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                />
              )}
              {product.tags && product.tags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  variant="outlined" 
                  color="default" 
                  sx={{ 
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}
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
              sx={{ 
                mt: isMobile ? 1 : 0,
                transition: 'all 0.2s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              Hozzáadás
            </Button>
          }
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: isHovered ? 
              '0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)' : 
              '0 4px 6px rgba(0,0,0,0.05)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          contentProps={{
            sx: { flexGrow: 1 }
          }}
        >
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {product.description || 'Nincs leírás'}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1.5 
            }}>
              <Typography variant="body2">
                <strong>Mértékegység:</strong> {product.unit || product.defaultUnit || 'db'}
              </Typography>
              
              {product.popularity && (
                <Tooltip title="Népszerűség">
                  <Chip 
                    label={`${product.popularity}★`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Box>
          </Box>
        </Card>
      </div>
    </Grow>
  );
};

// Váz komponens a betöltéshez
const ProductCatalogItemSkeleton = ({ index }) => {
  return (
    <Grow
      in={true}
      style={{ transformOrigin: '0 0 0' }}
      timeout={200 + (index * 50)}
    >
      <Paper sx={{ p: 2, height: '100%' }}>
        <Skeleton variant="text" width="80%" height={40} />
        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 4 }} />
        </Box>
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rectangular" width={40} height={24} sx={{ borderRadius: 4 }} />
        </Box>
        <Skeleton variant="rectangular" height={40} width="100%" sx={{ mt: 2, borderRadius: 1 }} />
      </Paper>
    </Grow>
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
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortMethod, setSortMethod] = useState('name_asc');
  const [categories, setCategories] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const itemsPerPage = isMobile ? 6 : 9;

  // Kategóriák betöltése
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await CategoryService.getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Hiba a kategóriák betöltésekor:', error);
      }
    };
    
    loadCategories();
  }, []);

  // Rendezés menü
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = useCallback(() => {
    setSortAnchorEl(null);
  }, []);

  // Define sortProducts before it's used in handleSortChange
  const sortProducts = useCallback((productList, method) => {
    const sorted = [...productList];
    
    switch(method) {
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'category':
        sorted.sort((a, b) => {
          if (!a.category) return 1;
          if (!b.category) return -1;
          return a.category.localeCompare(b.category);
        });
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        break;
    }
    
    setProducts(sorted);
  }, []);

  const handleSortChange = useCallback((sortValue) => {
    setSortMethod(sortValue);
    handleSortClose();
    sortProducts(products, sortValue);
  }, [products, sortProducts, handleSortClose]);

  // Szűrés menü
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Termékek betöltése
  const fetchProducts = useCallback(async (query = '') => {
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
      
      // Szűrés kategóriák alapján, ha szükséges
      if (selectedCategories.length > 0) {
        data = data.filter(product => 
          product.category && selectedCategories.includes(product.category)
        );
      }
      
      // Rendezés
      sortProducts(data, sortMethod);
      setPage(1); // Visszaállítjuk az első oldalra
      setError(null);
    } catch (err) {
      setError(`Hiba a termékek betöltésekor: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [selectedCategories, sortMethod, sortProducts]);

  // Termékek betöltése az oldal betöltésekor és a szűrés változásakor
  useEffect(() => {
    fetchProducts(searchQuery);
  }, [selectedCategories, fetchProducts, searchQuery]);

  // Termékek betöltése az oldal első betöltésekor
  useEffect(() => {
    setTimeout(() => {
      fetchProducts();
    }, 500); // Kis késleltetés a vizuális hatás miatt
  }, [fetchProducts]);

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
    // Smooth scroll to top with animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

  // Aktív szűrők számolása
  const activeFiltersCount = selectedCategories.length;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Kereső és szűrők */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          mb: 3,
          width: '100%',
          gap: 2
        }}
      >
        <Input
          placeholder="Termék keresése..."
          value={searchQuery}
          onChange={handleSearchChange}
          startIcon={<SearchIcon />}
          fullWidth
        />
        
        <Box sx={{ 
          display: 'flex', 
          width: '100%',
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'nowrap'
        }}>
          <Button
            variant={activeFiltersCount > 0 ? "contained" : "outlined"}
            color={activeFiltersCount > 0 ? "secondary" : "primary"}
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ 
              flex: '1 1 50%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'all 0.2s ease'
            }}
          >
            {activeFiltersCount > 0 ? `Szűrők (${activeFiltersCount})` : 'Szűrés'}
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            sx={{ 
              flex: '1 1 50%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'all 0.2s ease'
            }}
          >
            Rendezés
          </Button>
        </Box>
      </Box>

      {/* Rendezés menü */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          onClick={() => handleSortChange('name_asc')}
          selected={sortMethod === 'name_asc'}
        >
          <ListItemIcon>
            <AlphabetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Név szerint (A-Z)</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('name_desc')}
          selected={sortMethod === 'name_desc'}
        >
          <ListItemIcon>
            <AlphabetIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
          </ListItemIcon>
          <ListItemText>Név szerint (Z-A)</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('category')}
          selected={sortMethod === 'category'}
        >
          <ListItemIcon>
            <CategoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Kategória szerint</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('popularity')}
          selected={sortMethod === 'popularity'}
        >
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Népszerűség szerint</ListItemText>
        </MenuItem>
      </Menu>

      {/* Szűrés menü */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: '250px',
          }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Szűrés kategória szerint
          </Typography>
        </Box>
        <Divider />
        {categories.map(category => (
          <MenuItem 
            key={category.id}
            onClick={() => handleFilterChange(category.id)}
            selected={selectedCategories.includes(category.id)}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <ListItemText>{category.name}</ListItemText>
            {selectedCategories.includes(category.id) && (
              <Chip 
                size="small" 
                color="primary" 
                label="✓" 
                sx={{ minWidth: 32 }} 
              />
            )}
          </MenuItem>
        ))}
        {selectedCategories.length > 0 && (
          <>
            <Divider />
            <MenuItem 
              onClick={() => setSelectedCategories([])}
              sx={{ color: theme.palette.primary.main }}
            >
              <ListItemText>Szűrők törlése</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Hibaüzenet */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Szűrők jelzése */}
      {selectedCategories.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
            Aktív szűrők:
          </Typography>
          {selectedCategories.map(categoryId => {
            const categoryName = categories.find(c => c.id === categoryId)?.name || categoryId;
            return (
              <Chip
                key={categoryId}
                label={categoryName}
                onDelete={() => handleFilterChange(categoryId)}
                color="primary"
                size="small"
                variant="outlined"
              />
            );
          })}
          <Chip
            label="Összes törlése"
            onClick={() => setSelectedCategories([])}
            size="small"
            color="default"
          />
        </Box>
      )}

      {/* Termékek listája */}
      {initialLoading ? (
        <Grid container spacing={2}>
          {Array.from(new Array(itemsPerPage)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
              <ProductCatalogItemSkeleton index={index} />
            </Grid>
          ))}
        </Grid>
      ) : loading ? (
        <Fade in={loading} timeout={300}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexDirection: 'column',
              minHeight: '300px',
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography color="text.secondary" variant="body2">
              Termékek betöltése...
            </Typography>
          </Box>
        </Fade>
      ) : (
        <>
          {products.length === 0 ? (
            <Alert 
              severity="info" 
              sx={{ display: 'flex', alignItems: 'center' }}
              icon={<InfoOutlinedIcon fontSize="inherit" />}
            >
              Nem található termék a megadott keresési feltételekkel.
            </Alert>
          ) : (
            <>
              <Grid container spacing={2}>
                {paginatedProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id} sx={{ display: 'flex' }}>
                    <ProductCatalogItem 
                      product={product} 
                      onAddToList={handleAddToList} 
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {/* Találatok száma */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 3,
                mb: 2,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography variant="body2" color="text.secondary">
                  {products.length} termék található
                </Typography>
                
                {/* Pagináció */}
                {products.length > itemsPerPage && (
                  <Pagination 
                    count={Math.ceil(products.length / itemsPerPage)} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    siblingCount={isMobile ? 0 : 1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                        '&.Mui-selected': {
                          fontWeight: 'bold',
                        }
                      }
                    }}
                  />
                )}
              </Box>
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
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
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

export default ProductCatalogBrowser; 