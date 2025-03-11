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
  Drawer,
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
  LinearProgress
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
        setError(`Hiba az adatok betöltésekor: ${err.message}`);
      } finally {
        setLoading(false);
        // Kis késleltetés a vizuális hatás miatt
        setTimeout(() => {
          setInitialLoading(false);
        }, 500);
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
          <CategoryIcon sx={{ mr: 1 }} />
          Kategóriák
        </Typography>
        <IconButton onClick={handleCategoryDrawerToggle} edge="end" aria-label="bezárás" sx={{ color: 'inherit' }}>
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
          </Box>
        </Box>
      ) : (
        <Fade in={!initialLoading} timeout={500}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Navigáció */}
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ mb: 2 }}
            >
              <Link 
                color="inherit" 
                href="/" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
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
                  fontWeight: 'bold'
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
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                textShadow: '0px 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <InventoryIcon 
                sx={{ 
                  mr: 1, 
                  fontSize: '2rem',
                  color: theme.palette.primary.main
                }} 
              />
              Termékkatalógus
            </Typography>
            
            {/* Fő tartalom */}
            <Grid container spacing={2}>
              {/* Listák kiválasztása és termék hozzáadási gomb */}
              <Grid item xs={12}>
                <Slide direction="down" in={true} timeout={500} mountOnEnter>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: { xs: 2, sm: 3 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      {/* Statisztikai kártyák */}
                      <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6} sm={3}>
                            <Card 
                              sx={{ 
                                bgcolor: theme.palette.primary.light + '20',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 5px 10px rgba(0,0,0,0.08)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Termékek
                                  </Typography>
                                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
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
                                bgcolor: theme.palette.secondary.light + '20',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 5px 10px rgba(0,0,0,0.08)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Kategóriák
                                  </Typography>
                                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
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
                                bgcolor: theme.palette.success.light + '20',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 5px 10px rgba(0,0,0,0.08)'
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Listák
                                  </Typography>
                                  <Avatar sx={{ bgcolor: theme.palette.success.main, width: 32, height: 32 }}>
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
                                bgcolor: theme.palette.info.light + '20',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'translateY(-3px)',
                                  boxShadow: '0 5px 10px rgba(0,0,0,0.08)'
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
                                  <Avatar sx={{ bgcolor: theme.palette.info.main, width: 32, height: 32 }}>
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

                      <Grid item xs={12} sm={isMobile ? 12 : 4}>
                        <Typography variant="subtitle1" fontWeight="medium">
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
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main + '50'
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main
                                  }
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    style: {
                                      maxHeight: 48 * 4.5,
                                      width: 250,
                                    },
                                  },
                                }}
                              >
                                {lists.map(list => (
                                  <MenuItem key={list._id} value={list._id}>
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                      <BookmarkIcon 
                                        fontSize="small" 
                                        sx={{ 
                                          mr: 1, 
                                          color: list.color || theme.palette.primary.main 
                                        }} 
                                      />
                                      {list.title}
                                      <Badge 
                                        badgeContent={list.products.length} 
                                        color="primary"
                                        sx={{ ml: 1 }}
                                      />
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Tooltip title="Listák frissítése">
                              <IconButton 
                                onClick={handleRefreshLists} 
                                color="primary"
                                sx={{ ml: 1 }}
                                disabled={loading}
                              >
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            Nincs elérhető bevásárlólista
                          </Alert>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={isMobile ? 12 : 8} sx={{ 
                        display: 'flex', 
                        justifyContent: { xs: 'center', sm: 'flex-end' },
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: { xs: 2, sm: 0 }
                      }}>
                        {isMobile && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleCategoryDrawerToggle}
                            startIcon={<CategoryIcon />}
                            sx={{ 
                              flex: '1 1 auto', 
                              minWidth: isSmallMobile ? '100%' : 'auto',
                              mb: isSmallMobile ? 1 : 0
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
                            transition: 'all 0.2s ease',
                            '&:not(:disabled):hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
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
                    <Box>
                      <CategorySelector 
                        onCategorySelect={handleCategorySelect}
                        selectedCategory={selectedCategory}
                      />
                    </Box>
                  </Fade>
                </Grid>
              )}
              
              <Grid item xs={12} md={!isMobile ? 9 : 12}>
                <Fade in={true} timeout={1000}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: { xs: 2, sm: 3 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
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
                            '&:hover': {
                              bgcolor: theme.palette.primary.light + '10'
                            }
                          }
                        }}
                      >
                        <Tab 
                          label={isMobile ? "" : "Termékkatalógus"} 
                          icon={<InventoryIcon />} 
                          iconPosition="start"
                          aria-label="Termékkatalógus"
                        />
                        <Tab 
                          label={isMobile ? "" : "Kategóriák"} 
                          icon={<CategoryIcon />} 
                          iconPosition="start"
                          aria-label="Kategóriák"
                        />
                        <Tab 
                          label={isMobile ? "" : "Részletes beállítások"} 
                          icon={<TuneIcon />}
                          iconPosition="start"
                          aria-label="Részletes beállítások"
                          disabled
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
                        <Alert severity="info" sx={{ mb: 3 }}>
                          A kategóriák részletes böngészése fejlesztés alatt áll. Addig is használja a bal oldali kategória sávot vagy a kereső és szűrő funkciókat!
                        </Alert>
                        
                        {/* Kategóriák nézetét itt lehet majd részletesen implementálni */}
                        <Grid container spacing={2}>
                          {Array.from(new Array(6)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Skeleton variant="rectangular" height={100} width="100%" sx={{ borderRadius: 1 }} />
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
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Termék részletek
          </Typography>
          <IconButton
            onClick={handleCloseProductDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
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
      
      {/* Fiók a termék hozzáadásához */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? '12px 12px 0 0' : 0,
            maxHeight: isMobile ? '90vh' : '100vh'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Fiók a kategóriákhoz (csak mobilon) */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'left'}
        open={categoryDrawerOpen}
        onClose={handleCategoryDrawerToggle}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? '12px 12px 0 0' : 0,
            maxHeight: isMobile ? '80vh' : '100vh'
          }
        }}
      >
        {categoryDrawerContent}
      </Drawer>
      
      {/* Snackbar értesítések */}
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
          sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
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