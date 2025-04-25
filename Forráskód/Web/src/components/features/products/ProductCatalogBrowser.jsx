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
  Skeleton,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SortIcon from '@mui/icons-material/Sort';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlphabetIcon from '@mui/icons-material/SortByAlpha';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ScaleIcon from '@mui/icons-material/Scale';

// Importáljuk a közös komponenseket
import Input from '../../common/Input/index';
import Button from '../../common/Button/index';
import Card from '../../common/Card/index';

// Importáljuk a szolgáltatásokat
import ProductCatalogService from '../../../services/productCatalog.service';
import CategoryService from '../../../services/category.service';

// Termékenkénti kártya komponens
const ProductCatalogItem = ({ product, onAddToList, index, categoryMap, categories }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Get category name from map
  const getCategoryName = (categoryId) => {
    // If we have a valid category ID and it exists in our map, return the name
    if (categoryId && categoryMap && categoryMap[categoryId]) {
      return categoryMap[categoryId];
    }
    
    // Otherwise just return a default label instead of the ID
    return "Kategória";
  };
  
  // Get category description for a given category ID
  const getCategoryDescription = (categoryId) => {
    // Find the category in the original categories array
    const category = categories.find(cat => cat._id === categoryId);
    return category?.description || null;
  };
  
  // Find the most appropriate description to display
  const getDescription = () => {
    // First try the product description
    if (product.description) {
      return product.description;
    }
    
    // If no product description, try to get category description
    if (product.category) {
      const catId = Array.isArray(product.category) ? product.category[0] : product.category;
      const categoryDesc = getCategoryDescription(catId);
      if (categoryDesc) {
        return categoryDesc;
      }
    }
    
    // Fallback to other product fields
    if (product.details) {
      return product.details;
    }
    
    if (product.info) {
      return product.info;
    }
    
    // Final fallback
    return 'Ez egy termék a katalógusból.';
  };

  // Truncate description for mobile or if it's too long
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

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
                <Tooltip title="Kategória" arrow placement="top">
                  <Chip 
                    icon={<CategoryIcon fontSize="small" />}
                    label={Array.isArray(product.category) 
                      ? product.category.map(catId => getCategoryName(catId)).join(', ')
                      : getCategoryName(product.category)} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      borderRadius: '16px',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        backgroundColor: theme.palette.primary.main + '10'
                      }
                    }}
                  />
                </Tooltip>
              )}
              {product.tags && product.tags.slice(0, isMobile ? 1 : 2).map(tag => (
                <Tooltip key={tag} title="Címke" arrow placement="top">
                  <Chip 
                    icon={<LocalOfferIcon fontSize="small" />}
                    label={tag} 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    sx={{ 
                      transition: 'all 0.2s ease',
                      borderRadius: '16px',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        backgroundColor: theme.palette.secondary.main + '10'
                      }
                    }}
                  />
                </Tooltip>
              ))}
              {product.tags && product.tags.length > (isMobile ? 1 : 2) && (
                <Tooltip title={product.tags.slice(isMobile ? 1 : 2).join(', ')} arrow placement="top">
                  <Chip 
                    label={`+${product.tags.length - (isMobile ? 1 : 2)}`}
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      borderRadius: '16px',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          }
          actions={
            <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size={isMobile ? "small" : "medium"}
                startIcon={<AddShoppingCartIcon />}
                onClick={() => onAddToList(product)}
                fullWidth
                sx={{ 
                  borderRadius: '8px',
                  flex: '1 1 auto',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Listához
              </Button>
            </Box>
          }
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            boxShadow: isHovered ? 
              '0 16px 32px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.08)' : 
              '0 4px 8px rgba(0,0,0,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            border: `1px solid ${theme.palette.divider}`,
            '&:after': isHovered ? {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '10%',
              width: '80%',
              height: '5px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '2.5px'
            } : {}
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          elevation={isHovered ? 8 : 2}
          content={
            <Box sx={{ py: 1, flexGrow: 1 }}>
              {/* Description with expand/collapse */}
              <Collapse in={isMobile || showDetails} collapsedSize={isMobile ? "100%" : "75px"}>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 1.5,
                  lineHeight: 1.5
                }}>
                  {getDescription()}
                </Typography>
              </Collapse>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1,
                mt: 1.5 
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                  <Tooltip title="Alapértelmezett mértékegység" arrow placement="top">
                    <Chip 
                      icon={<ScaleIcon fontSize="small" />}
                      label={`${product.defaultUnit || 'db'}`}
                      size="small"
                      color="info"
                      variant="outlined"
                      sx={{
                        borderRadius: '16px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.info.light + '20'
                        }
                      }}
                    />
                  </Tooltip>
                  
                  {product.popularity && (
                    <Tooltip title="Népszerűség" arrow placement="top">
                      <Chip 
                        icon={<FactCheckIcon fontSize="small" />}
                        label={`${product.popularity}★`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{
                          borderRadius: '16px',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.secondary.light + '20'
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
                
                {product.brand && (
                  <Typography variant="body2" sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                    <strong>Márka:</strong> 
                    <Chip 
                      label={product.brand}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, height: '20px', fontSize: '0.7rem', borderRadius: '10px' }}
                    />
                  </Typography>
                )}
                
                {product.barcode && (
                  <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    <strong>Vonalkód:</strong> {product.barcode}
                  </Typography>
                )}
              </Box>
            </Box>
          }
        >
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

// Továbbfejlesztett kereső és szűrő komponensek
const AdvancedSearch = ({ 
  searchQuery,
  onSearchChange,
  sortMethod,
  onSortClick,
  onFilterClick,
  activeCategoryFilterCount
}) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        mb: 3,
        width: '100%',
        gap: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <Input
          placeholder="Termék keresése..."
          value={searchQuery}
          onChange={onSearchChange}
          startIcon={<SearchIcon />}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              pr: '0',
              '&:hover': {
                boxShadow: '0 0 0 4px rgba(63, 81, 181, 0.1)'
              },
              '&.Mui-focused': {
                boxShadow: '0 0 0 4px rgba(63, 81, 181, 0.2)'
              }
            }
          }}
        />
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        width: '100%',
        justifyContent: 'space-between',
        gap: 1.5,
        flexWrap: 'nowrap'
      }}>
        <Button
          variant={activeCategoryFilterCount > 0 ? "contained" : "outlined"}
          color={activeCategoryFilterCount > 0 ? "secondary" : "primary"}
          startIcon={<FilterListIcon />}
          onClick={onFilterClick}
          sx={{ 
            flex: '1 1 50%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            boxShadow: activeCategoryFilterCount > 0 ? '0 4px 12px rgba(245, 0, 87, 0.25)' : 'none',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: activeCategoryFilterCount > 0 ? 
                '0 6px 16px rgba(245, 0, 87, 0.3)' : 
                '0 4px 12px rgba(0, 0, 0, 0.08)'
            }
          }}
        >
          {activeCategoryFilterCount > 0 ? `Kategória szűrő aktív` : 'Szűrés'}
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<SortIcon />}
          onClick={onSortClick}
          sx={{ 
            flex: '1 1 50%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.3s ease',
            borderRadius: '10px',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }
          }}
        >
          {sortMethod === 'name_asc' ? 'Név (A-Z)' : 
           sortMethod === 'name_desc' ? 'Név (Z-A)' : 
           sortMethod === 'category' ? 'Kategória' : 
           sortMethod === 'popularity' ? 'Népszerűség' : 'Rendezés'}
        </Button>
      </Box>
    </Box>
  );
};

const ProductCatalogBrowser = ({ onAddToList, selectedListId, selectedCategory }) => {
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const itemsPerPage = isMobile ? 6 : 9;

  // Enhanced category loading with better error handling
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await CategoryService.getAllCategories();
        
        if (!Array.isArray(categoryData)) {
          console.error('Category data is not an array:', categoryData);
          return;
        }
        
        console.log('Betöltött kategóriák a ProductCatalogBrowser-ben:', categoryData);
        setCategories(categoryData);
        
        // Create a map of category IDs to category names (not complex objects)
        const catMap = {};
        if (Array.isArray(categoryData)) {
          categoryData.forEach(category => {
            if (category && category._id) {
              // Store just the name as before, not an object
              catMap[category._id] = category.name;
              
              // Also add the stringified ID as a key for comparison flexibility
              const stringId = String(category._id);
              if (stringId !== category._id) {
                catMap[stringId] = category.name;
              }
              
              // Ha a kategória neve valamelyik előre definiált értéknek felel meg, 
              // akkor azt is vegyük fel (backward compatibility)
              const lowerName = category.name.toLowerCase();
              switch (lowerName) {
                case 'pékáruk':
                  catMap['bakery'] = category.name;
                  break;
                case 'tejtermékek':
                  catMap['dairy'] = category.name;
                  break;
                case 'húsáruk':
                  catMap['meat'] = category.name;
                  break;
                case 'zöldségek és gyümölcsök':
                  catMap['vegetables'] = category.name;
                  catMap['fruits'] = category.name;
                  break;
                case 'élelmiszerek':
                  catMap['groceries'] = category.name;
                  break;
                case 'háztartási cikkek':
                  catMap['household'] = category.name;
                  break;
                case 'italok':
                  catMap['drinks'] = category.name;
                  break;
                case 'tisztítószerek':
                  catMap['cleaning'] = category.name;
                  break;
              }
            } else {
              console.warn('Invalid category object:', category);
            }
          });
        }
        console.log('Kategória map:', catMap);
        setCategoryMap(catMap);
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

  // Define sortProducts (client-side sorting remains for now)
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
          
          // Get category names for comparison
          const aName = Array.isArray(a.category) 
            ? categoryMap[a.category[0]] || '' 
            : categoryMap[a.category] || '';
          const bName = Array.isArray(b.category) 
            ? categoryMap[b.category[0]] || '' 
            : categoryMap[b.category] || '';
            
          return aName.localeCompare(bName);
        });
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        break;
    }
    
    setProducts(sorted);
  }, [categoryMap]);

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

  // Placeholder if other filter types are added later
  // const handleFilterChange = (filterType, value) => { ... };

  // Enhanced product loading
  const fetchProducts = useCallback(async (query = '', categoryFilter = 'all') => {
    setLoading(true);
    try {
      let data;
      // Construct parameters for API call
      const params = {};
      if (query.trim()) {
        params.query = query.trim();
      }
      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter;
      }
      
      console.log('Paraméterek a kéréshez:', params);
      console.log('Kategória szűrő:', categoryFilter);
      
      // Use a single endpoint, assuming it handles both search and filtering
      const response = await ProductCatalogService.getAllCatalogItems({ params });
      data = response;
      
      console.log('Szerver válasza:', data.length, 'termék');
      if (data.length > 0) {
        console.log('Első termék mintának:', {
          name: data[0].name,
          category: data[0].category
        });
      }
      
      // Rendezés
      sortProducts(data, sortMethod);
      setPage(1); // Visszaállítjuk az első oldalra
      setError(null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(`Hiba a termékek betöltésekor: ${err.message}`);
      setProducts([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [sortMethod, sortProducts]);

  // Termékek betöltése az oldal betöltésekor és a szűrés/keresés változásakor
  useEffect(() => {
    // Fetch based on current search query and selected category
    fetchProducts(searchQuery, selectedCategory);
  }, [selectedCategory, searchQuery, fetchProducts]);

  // Termékek betöltése az oldal első betöltésekor
  useEffect(() => {
    const timer = setTimeout(() => {
      // Initial fetch, potentially with a default category if needed
      fetchProducts(searchQuery, selectedCategory);
    }, 300); // Kis késleltetés a vizuális hatás miatt
    
    return () => clearTimeout(timer);
  }, [fetchProducts, searchQuery, selectedCategory]); // Add dependencies

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
      fetchProducts(query, selectedCategory); // Pass selectedCategory here too
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

  // Determine if a category filter is active (excluding 'all')
  const activeCategoryFilterCount = (selectedCategory && selectedCategory !== 'all') ? 1 : 0;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Továbbfejlesztett kereső és szűrő komponens */}
      <AdvancedSearch 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        sortMethod={sortMethod}
        onSortClick={handleSortClick}
        onFilterClick={handleFilterClick}
        activeCategoryFilterCount={activeCategoryFilterCount}
      />

      {/* Rendezés menü */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            mt: 1.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem 
          onClick={() => handleSortChange('name_asc')}
          selected={sortMethod === 'name_asc'}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            transition: 'background-color 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.light + '30',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '40', 
              }
            }
          }}
        >
          <ListItemIcon>
            <AlphabetIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Név szerint (A-Z)</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('name_desc')}
          selected={sortMethod === 'name_desc'}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            transition: 'background-color 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.light + '30',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '40', 
              }
            }
          }}
        >
          <ListItemIcon>
            <AlphabetIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
          </ListItemIcon>
          <ListItemText>Név szerint (Z-A)</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('category')}
          selected={sortMethod === 'category'}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            transition: 'background-color 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.light + '30',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '40', 
              }
            }
          }}
        >
          <ListItemIcon>
            <CategoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Kategória szerint</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('popularity')}
          selected={sortMethod === 'popularity'}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            mb: 0.5,
            transition: 'background-color 0.2s ease',
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.light + '30',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '40', 
              }
            }
          }}
        >
          <ListItemIcon>
            <AccessTimeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Népszerűség szerint</ListItemText>
        </MenuItem>
      </Menu>

      {/* Szűrés menü - Keep for potential future filter types (e.g., tags, price) */}
      {/* Currently disabled as filtering is handled by CategorySelector */}
      {/* 
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            maxHeight: 350,
            width: '280px',
            borderRadius: 2,
            mt: 1.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
            Szűrés kategória szerint
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 250, overflowY: 'auto', py: 0.5 }}>
          {categories.map(category => (
            <MenuItem 
              key={category._id}
              onClick={() => handleFilterChange(category._id)}
              selected={selectedCategories.includes(category._id)}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                borderRadius: 1,
                mx: 0.5,
                mb: 0.5,
                transition: 'background-color 0.2s ease',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light + '30',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '40', 
                  }
                }
              }}
            >
              <ListItemText primary={category.name} />
              {selectedCategories.includes(category._id) && (
                <Chip 
                  size="small" 
                  color="primary" 
                  label="✓" 
                  sx={{ 
                    minWidth: 32,
                    borderRadius: '10px',
                    transition: 'all 0.2s ease'
                  }} 
                />
              )}
            </MenuItem>
          ))}
        </Box>
        {selectedCategories.length > 0 && (
          <>
            <Divider />
            <MenuItem 
              onClick={() => setSelectedCategories([])}
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                borderRadius: 1,
                mx: 0.5,
                my: 0.5,
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '20'
                }
              }}
            >
              <ListItemText sx={{ textAlign: 'center' }}>Szűrők törlése</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
      */}

      {/* Hibaüzenet */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
            border: `1px solid ${theme.palette.error.light}`
          }}
        >
          {error}
        </Alert>
      )}

      {/* Aktív kategória szűrő jelzése */}
      {selectedCategory && selectedCategory !== 'all' && (
        <Fade in={selectedCategory && selectedCategory !== 'all'}>
          <Box sx={{ 
            mb: 2, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            p: 2, 
            borderRadius: 2,
            backgroundColor: `${theme.palette.background.paper}`,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="body2" sx={{ mr: 1, display: 'flex', alignItems: 'center', color: theme.palette.text.secondary }}>
              <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
              Aktív kategória szűrő:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 1 }}>
              <Chip
                label={categoryMap[selectedCategory] || selectedCategory}
                color="primary"
                size="small"
                sx={{
                  borderRadius: '16px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }
                }}
              />
            </Box>
          </Box>
        </Fade>
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
            <CircularProgress 
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
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
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                backgroundColor: theme.palette.info.light + '30',
                border: `1px solid ${theme.palette.info.light}`
              }}
              icon={<InfoOutlinedIcon fontSize="inherit" />}
            >
              Nem található termék a megadott keresési feltételekkel.
            </Alert>
          ) : (
            <>
              <Grid container spacing={2.5}>
                {paginatedProducts.map((product, index) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id} sx={{ display: 'flex' }}>
                    <ProductCatalogItem 
                      product={product} 
                      onAddToList={handleAddToList} 
                      index={index}
                      categoryMap={categoryMap}
                      categories={categories}
                    />
                  </Grid>
                ))}
              </Grid>
              
              {/* Találatok száma és Pagináció */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
                mb: 1,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography variant="body2" color="text.secondary" sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontWeight: 'medium',
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
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
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        transition: 'all 0.2s ease',
                        borderRadius: '8px',
                        margin: '0 2px',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: theme.palette.primary.light + '30'
                        },
                        '&.Mui-selected': {
                          fontWeight: 'bold',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
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
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }}
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