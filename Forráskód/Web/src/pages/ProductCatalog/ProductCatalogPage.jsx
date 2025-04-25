import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Paper, 
  Tab, 
  Tabs, 
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
  Zoom,
  Fade,
  Alert,
  Snackbar,
  Badge,
  Card,
  CardContent,
  Skeleton,
  Breadcrumbs,
  Link,
  Avatar,
  Slide,
  LinearProgress,
  SwipeableDrawer,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TuneIcon from '@mui/icons-material/Tune';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Importáljuk a közös komponenseket
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

// Importáljuk a termék komponenseket
import ProductCatalogBrowser from '../../components/features/products/ProductCatalogBrowser';
import CategorySelector from '../../components/features/products/CategorySelector';
import AddProductForm from '../../components/features/products/AddProductForm';
import ProductDetails from '../../components/features/products/ProductDetails';

// Importáljuk a szolgáltatásokat
import ListService from '../../services/list.service';
import CategoryService from '../../services/category.service';
import ProductCatalogService from '../../services/productCatalog.service';

const ProductCatalogPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [statsSummary, setStatsSummary] = useState({
    totalProducts: 0,
    totalCategories: 0
  });
  const [initialLoading, setInitialLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listák és statisztikák betöltése
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Párhuzamos adatlekérések
        const [listsData, catalogSummary, categoryData] = await Promise.all([
          ListService.getUserLists(),
          ProductCatalogService.getAllCatalogItems(),
          CategoryService.getAllCategories()
        ]);
        
        setLists(listsData);
        
        // Statisztikák beállítása
        setStatsSummary({
          totalProducts: catalogSummary.length,
          totalCategories: categoryData.length
        });
        
        // Ha van lista, alapértelmezetten kiválasztjuk az elsőt
        if (listsData.length > 0) {
          setSelectedListId(listsData[0]._id);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Hiba az adatok betöltésekor: ${err.message}`);
      } finally {
        setLoading(false);
        // Progressively reveal UI with staggered transitions
        setTimeout(() => {
          setInitialLoading(false);
        }, 300);
      }
    };
    
    fetchInitialData();
  }, []);

  // Tab váltás kezelése
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Kategória választás kezelése
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (isMobile) {
      setCategoryDrawerOpen(false);
    }
  };

  // Lista választás kezelése
  const handleListChange = (event) => {
    setSelectedListId(event.target.value);
  };

  // Termék hozzáadásának kezelése
  const handleAddToList = async (product) => {
    if (!selectedListId) {
      setSnackbar({
        open: true,
        message: 'Nincs kiválasztva bevásárlólista!',
        severity: 'warning'
      });
      return;
    }
    
    try {
      const productData = {
        name: product.name,
        unit: product.unit || 'db',
        quantity: 1
      };
      
      if (product._id) {
        productData.catalogItem = product._id;
      }
      
      await ListService.addProductToList(selectedListId, productData);
      
      // Frissítjük a listákat
      const updatedLists = await ListService.getUserLists();
      setLists(updatedLists);
      
      // Sikeres üzenet
      setSnackbar({
        open: true,
        message: `"${product.name}" sikeresen hozzáadva a listához!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Hiba a termék hozzáadásakor:', error);
      setSnackbar({
        open: true,
        message: `Hiba a termék hozzáadásakor: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Termék dialógus kezelése
  const handleOpenProductDialog = (product) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setSelectedProduct(null);
  };

  // Fiók kezelése
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCategoryDrawerToggle = () => {
    setCategoryDrawerOpen(!categoryDrawerOpen);
  };

  // Snackbar kezelése
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Listák frissítése
  const handleRefreshLists = async () => {
    setLoading(true);
    try {
      const data = await ListService.getUserLists();
      setLists(data);
      setSnackbar({
        open: true,
        message: 'Listák sikeresen frissítve!',
        severity: 'success'
      });
    } catch (err) {
      setError(`Hiba a listák frissítésekor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Termék sikeresen hozzáadva callback
  const handleProductAdded = () => {
    // Frissítjük a listákat
    ListService.getUserLists().then(data => setLists(data));
  };

  // Új termék hozzáadás fiók tartalma
  const drawerContent = (
    <Box sx={{ 
      width: isMobile ? '100%' : 400,
      height: isMobile ? 'auto' : '100%',
      maxHeight: isMobile ? '90vh' : '100vh',
      overflow: 'auto',
      bgcolor: theme.palette.background.paper
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <AddIcon sx={{ mr: 1 }} />
          Termék hozzáadása
        </Typography>
        <IconButton onClick={handleDrawerToggle} edge="end" aria-label="bezárás" sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <AddProductForm 
        listId={selectedListId}
        onAddSuccess={handleProductAdded}
      />
    </Box>
  );

  // Fiók tartalom - kategóriák (csak mobilon)
  const categoryDrawerContent = (
    <Box sx={{ 
      width: isMobile ? '100%' : 300,
      height: isMobile ? 'auto' : '100%',
      maxHeight: isMobile ? '80vh' : '100vh',
      overflow: 'auto',
      bgcolor: theme.palette.background.paper,
      borderTopLeftRadius: isMobile ? '16px' : 0,
      borderTopRightRadius: isMobile ? '16px' : 0,
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderTopLeftRadius: isMobile ? '16px' : 0,
        borderTopRightRadius: isMobile ? '16px' : 0,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1 }} />
          Kategóriák
        </Typography>
        <IconButton 
          onClick={handleCategoryDrawerToggle} 
          edge="end" 
          aria-label="bezárás" 
          sx={{ 
            color: 'inherit',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'rotate(90deg)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <CategorySelector 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {initialLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress sx={{ borderRadius: 0 }} />
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
            <Grid container spacing={2}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : (
        <Fade in={!initialLoading} timeout={500}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Navigáció */}
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ 
                mb: 2,
                '& .MuiBreadcrumbs-ol': {
                  flexWrap: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }}
            >
              <Link 
                color="inherit" 
                href="/" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { 
                    textDecoration: 'underline',
                    color: theme.palette.primary.main 
                  }
                }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Kezdőlap
              </Link>
              <Typography 
                color="text.primary" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                <InventoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Termékkatalógus
              </Typography>
            </Breadcrumbs>
            
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                mb: { xs: 2, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                fontSize: { xs: '1.7rem', sm: '2.2rem' },
                transition: 'all 0.3s ease'
              }}
            >
              <InventoryIcon 
                sx={{ 
                  mr: 1.5, 
                  fontSize: { xs: '1.7rem', sm: '2.2rem' },
                  color: theme.palette.primary.main
                }} 
              />
              Termékkatalógus
            </Typography>
            
            {/* Fő tartalom */}
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {/* Listák kiválasztása és termék hozzáadási gomb */}
              <Grid item xs={12}>
                <Slide direction="down" in={true} timeout={500} mountOnEnter>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: { xs: 2, sm: 3 },
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
                      {/* Statisztikai kártyák */}
                      <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ mb: { xs: 2, md: 0 } }}>
                          <Grid item xs={6} sm={3}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                transition: 'all 0.3s ease',
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.primary.light}40)`,
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${theme.palette.primary.light}50`,
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Termékek
                                  </Typography>
                                  <Avatar sx={{ 
                                    bgcolor: theme.palette.primary.main, 
                                    width: 32, 
                                    height: 32,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                  }}>
                                    <InventoryIcon fontSize="small" />
                                  </Avatar>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                                  {statsSummary.totalProducts}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                transition: 'all 0.3s ease',
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.secondary.light}20, ${theme.palette.secondary.light}40)`,
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${theme.palette.secondary.light}50`,
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Kategóriák
                                  </Typography>
                                  <Avatar sx={{ 
                                    bgcolor: theme.palette.secondary.main, 
                                    width: 32, 
                                    height: 32,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                  }}>
                                    <CategoryIcon fontSize="small" />
                                  </Avatar>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                                  {statsSummary.totalCategories}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                transition: 'all 0.3s ease',
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.success.light}20, ${theme.palette.success.light}40)`,
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${theme.palette.success.light}50`,
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Listák
                                  </Typography>
                                  <Avatar sx={{ 
                                    bgcolor: theme.palette.success.main, 
                                    width: 32, 
                                    height: 32,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                  }}>
                                    <BookmarkIcon fontSize="small" />
                                  </Avatar>
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                                  {lists.length}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                transition: 'all 0.3s ease',
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.info.light}20, ${theme.palette.info.light}40)`,
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${theme.palette.info.light}50`,
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }
                              }}
                              onClick={() => {
                                setSnackbar({
                                  open: true,
                                  message: 'A részletes statisztikák jelenleg fejlesztés alatt állnak.',
                                  severity: 'info'
                                });
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Statisztikák
                                  </Typography>
                                  <Avatar sx={{ 
                                    bgcolor: theme.palette.info.main, 
                                    width: 32, 
                                    height: 32,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                  }}>
                                    <BarChartIcon fontSize="small" />
                                  </Avatar>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                  <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                                  Részletek megtekintése
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={6} md={5} lg={4}>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{
                          color: theme.palette.text.primary,
                          mb: 1
                        }}>
                          Aktív bevásárlólista:
                        </Typography>
                        {loading ? (
                          <Loader size={24} />
                        ) : lists.length > 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <FormControl fullWidth>
                              <Select
                                value={selectedListId || ''}
                                onChange={handleListChange}
                                displayEmpty
                                sx={{ 
                                  minWidth: '100%',
                                  borderRadius: 2,
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main + '50',
                                    borderWidth: '1.5px',
                                    borderRadius: 2
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: '2px'
                                  },
                                  '& .MuiSelect-select': {
                                    padding: '12px 14px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 48 * 4.5,
                                      width: 'auto',
                                      minWidth: '200px',
                                      borderRadius: 8,
                                      marginTop: 8
                                    },
                                  },
                                  transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left'
                                  }
                                }}
                              >
                                {lists.map(list => (
                                  <MenuItem key={list._id} value={list._id} sx={{
                                    transition: 'background 0.2s ease',
                                    '&:hover': {
                                      backgroundColor: theme.palette.primary.light + '20'
                                    },
                                    '&.Mui-selected': {
                                      backgroundColor: theme.palette.primary.light + '30',
                                      '&:hover': {
                                        backgroundColor: theme.palette.primary.light + '40'
                                      }
                                    }
                                  }}>
                                    <Typography sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      width: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis', 
                                      whiteSpace: 'nowrap' 
                                    }}>
                                      <BookmarkIcon 
                                        fontSize="small" 
                                        sx={{ 
                                          mr: 1, 
                                          color: list.color || theme.palette.primary.main,
                                          flexShrink: 0
                                        }} 
                                      />
                                      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', flexGrow: 1 }}>
                                        {list.title}
                                      </Box>
                                      <Badge 
                                        badgeContent={list.products.length} 
                                        color="primary"
                                        sx={{ ml: 1, flexShrink: 0 }}
                                      />
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Tooltip title="Listák frissítése" arrow>
                              <IconButton 
                                onClick={handleRefreshLists} 
                                color="primary"
                                sx={{ 
                                  ml: 1,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: theme.palette.primary.light + '30',
                                    transform: 'rotate(180deg)'
                                  }
                                }}
                                disabled={loading}
                              >
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Alert 
                            severity="warning" 
                            variant="outlined"
                            sx={{ 
                              mt: 1, 
                              borderRadius: 2,
                              '& .MuiAlert-icon': {
                                color: theme.palette.warning.main
                              }
                            }}
                          >
                            Nincs elérhető bevásárlólista
                          </Alert>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={7} lg={8} sx={{
                        display: 'flex', 
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        mt: { xs: 2, sm: 0 }
                      }}>
                        {isMobile && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCategoryDrawerToggle}
                            startIcon={<CategoryIcon />}
                            sx={{ 
                              flex: '1 1 auto', 
                              minWidth: isSmallMobile ? '100%' : 'auto',
                              mb: isSmallMobile ? 1 : 0,
                              borderRadius: 2,
                              borderWidth: '1.5px',
                              py: 1.2,
                              backgroundColor: theme.palette.background.paper,
                              borderColor: theme.palette.secondary.main + '80',
                              color: theme.palette.secondary.main,
                              '&:hover': {
                                borderWidth: '1.5px',
                                backgroundColor: theme.palette.secondary.light + '10',
                                borderColor: theme.palette.secondary.main
                              }
                            }}
                          >
                            Kategóriák
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleDrawerToggle}
                          startIcon={<AddIcon />}
                          disabled={!selectedListId}
                          sx={{ 
                            flex: '1 1 auto', 
                            minWidth: isSmallMobile ? '100%' : 'auto',
                            transition: 'all 0.3s ease',
                            borderRadius: 2,
                            py: 1.2,
                            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                            '&:not(:disabled):hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 20px rgba(63, 81, 181, 0.4)'
                            },
                            '&:disabled': {
                              backgroundColor: theme.palette.action.disabledBackground,
                              color: theme.palette.action.disabled
                            }
                          }}
                        >
                          Saját termék hozzáadása
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Slide>
              </Grid>
              
              {/* Fő tartalom: Katalógus böngésző és kategória szűrő */}
              {!isMobile && (
                <Grid item xs={12} md={3}>
                  <Fade in={true} timeout={800}>
                    <Paper sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      height: '100%',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.09)'
                      }
                    }}>
                      <CategorySelector 
                        onCategorySelect={handleCategorySelect}
                        selectedCategory={selectedCategory}
                      />
                    </Paper>
                  </Fade>
                </Grid>
              )}
              
              <Grid item xs={12} md={!isMobile ? 9 : 12}>
                <Fade in={true} timeout={1000}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: { xs: 2, sm: 3 },
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Tabs 
                        value={selectedTab} 
                        onChange={handleTabChange}
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons={isMobile ? "auto" : false}
                        TabIndicatorProps={{
                          sx: {
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                          }
                        }}
                        sx={{
                          '& .MuiTab-root': {
                            transition: 'all 0.2s ease',
                            minHeight: 48,
                            borderBottom: '1px solid transparent',
                            '&:hover': {
                              bgcolor: theme.palette.primary.light + '15',
                              borderBottom: `1px solid ${theme.palette.primary.light}`,
                            },
                            '&.Mui-selected': {
                              color: theme.palette.primary.main,
                              fontWeight: 'bold'
                            }
                          }
                        }}
                      >
                        <Tab 
                          label={isMobile ? "" : "Termékkatalógus"} 
                          icon={<InventoryIcon />} 
                          iconPosition="start"
                          aria-label="Termékkatalógus"
                          sx={{
                            borderRadius: '8px 8px 0 0',
                          }}
                        />
                        <Tab 
                          label={isMobile ? "" : "Kategóriák"} 
                          icon={<CategoryIcon />} 
                          iconPosition="start"
                          aria-label="Kategóriák"
                          sx={{
                            borderRadius: '8px 8px 0 0',
                          }}
                        />
                        <Tab 
                          label={isMobile ? "" : "Részletes beállítások"} 
                          icon={<TuneIcon />}
                          iconPosition="start"
                          aria-label="Részletes beállítások"
                          disabled
                          sx={{
                            borderRadius: '8px 8px 0 0',
                          }}
                        />
                      </Tabs>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    {selectedTab === 0 && (
                      <ProductCatalogBrowser 
                        onAddToList={handleAddToList}
                        selectedListId={selectedListId}
                      />
                    )}
                    
                    {selectedTab === 1 && (
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                          <CategoryIcon sx={{ mr: 1 }} />
                          Kategóriák böngészése
                        </Typography>
                        <Alert 
                          severity="info" 
                          sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            backgroundColor: theme.palette.info.light + '30',
                            border: `1px solid ${theme.palette.info.light}`,
                            '& .MuiAlert-icon': {
                              color: theme.palette.info.main
                            }
                          }}
                        >
                          A kategóriák részletes böngészése fejlesztés alatt áll. Addig is használja a bal oldali kategória sávot vagy a kereső és szűrő funkciókat!
                        </Alert>
                        
                        {/* Kategóriák nézetét itt lehet majd részletesen implementálni */}
                        <Grid container spacing={2}>
                          {Array.from(new Array(6)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Skeleton 
                                variant="rectangular" 
                                height={100} 
                                width="100%" 
                                sx={{ 
                                  borderRadius: 2,
                                  animation: 'pulse 1.5s ease-in-out infinite',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 0.6 },
                                    '50%': { opacity: 0.3 },
                                    '100%': { opacity: 0.6 }
                                  }
                                }} 
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}
      
      {/* Termék részletek dialógus */}
      <Dialog
        open={productDialogOpen}
        onClose={handleCloseProductDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            overflow: 'hidden',
            height: isMobile ? '100%' : 'auto',
            margin: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Termék részletek
          </Typography>
          <IconButton
            onClick={handleCloseProductDialog}
            sx={{
              color: 'inherit',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'rotate(90deg)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
          {selectedProduct && (
            <ProductDetails 
              product={selectedProduct}
              listId={selectedListId}
              onUpdate={() => {
                // Frissítjük a listákat
                ListService.getUserLists().then(data => setLists(data));
              }}
              onDelete={() => {
                // Frissítjük a listákat és bezárjuk a dialógust
                ListService.getUserLists().then(data => setLists(data));
                handleCloseProductDialog();
              }}
              onClose={handleCloseProductDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Fiók a termék hozzáadásához - átalakítva SwipeableDrawer-ré jobb élmény érdekében */}
      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        onOpen={() => setDrawerOpen(true)}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? '16px 16px 0 0' : 0,
            maxHeight: isMobile ? '90vh' : '100vh',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            transition: (theme) => theme.transitions.create(['transform', 'border-radius'], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
          }
        }}
        swipeAreaWidth={30}
        disableSwipeToOpen={!isMobile}
      >
        {drawerContent}
      </SwipeableDrawer>

      {/* Fiók a kategóriákhoz (csak mobilon) - átalakítva SwipeableDrawer-ré*/}
      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'left'}
        open={categoryDrawerOpen}
        onClose={handleCategoryDrawerToggle}
        onOpen={() => setCategoryDrawerOpen(true)}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? '16px 16px 0 0' : 0,
            maxHeight: isMobile ? '80vh' : '100vh',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            transition: (theme) => theme.transitions.create(['transform', 'border-radius'], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
          }
        }}
        swipeAreaWidth={30}
        disableSwipeToOpen={!isMobile}
      >
        {categoryDrawerContent}
      </SwipeableDrawer>
      
      {/* Továbbfejlesztett Snackbar értesítések */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '16px',
            minWidth: isMobile ? '90%' : '400px',
            color: theme.palette.getContrastText(
              snackbar.severity === 'error' ? theme.palette.error.main :
              snackbar.severity === 'warning' ? theme.palette.warning.main :
              snackbar.severity === 'info' ? theme.palette.info.main :
              theme.palette.success.main
            ),
            transition: (theme) => theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.short,
            }),
          }
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%', 
            boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            borderRadius: '16px',
            alignItems: 'center',
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

export default ProductCatalogPage; 