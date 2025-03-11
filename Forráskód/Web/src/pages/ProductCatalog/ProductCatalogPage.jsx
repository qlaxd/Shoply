import React, { useState, useEffect } from 'react';
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
  InputLabel,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';

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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Listák betöltése
  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const data = await ListService.getUserLists();
        setLists(data);
        
        // Ha van lista, alapértelmezetten kiválasztjuk az elsőt
        if (data.length > 0) {
          setSelectedListId(data[0]._id);
        }
      } catch (err) {
        setError(`Hiba a listák betöltésekor: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLists();
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
    } catch (error) {
      console.error('Hiba a termék hozzáadásakor:', error);
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

  // Fiók tartalom - termék hozzáadás
  const drawerContent = (
    <Box sx={{ 
      width: isMobile ? '100%' : 300, 
      p: 2,
      maxHeight: isMobile ? '70vh' : '100vh',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Termék hozzáadása</Typography>
        <IconButton onClick={handleDrawerToggle} edge="end" aria-label="bezárás">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <AddProductForm 
        listId={selectedListId}
        onAddSuccess={() => {
          setDrawerOpen(false);
          // Frissítjük a listákat
          ListService.getUserLists().then(data => setLists(data));
        }}
      />
    </Box>
  );

  // Fiók tartalom - kategóriák
  const categoryDrawerContent = (
    <Box sx={{ 
      width: isMobile ? '100%' : 300, 
      p: 2,
      maxHeight: isMobile ? '70vh' : '100vh',
      overflow: 'auto'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Kategóriák</Typography>
        <IconButton onClick={handleCategoryDrawerToggle} edge="end" aria-label="bezárás">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <CategorySelector 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Termékkatalógus
        </Typography>
        
        {/* Fő tartalom */}
        <Grid container spacing={2}>
          {/* Listák kiválasztása és termék hozzáadási gomb */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={isMobile ? 12 : 4}>
                  <Typography variant="subtitle1">
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
                          sx={{ minWidth: '100%' }}
                        >
                          {lists.map(list => (
                            <MenuItem key={list._id} value={list._id}>
                              {list.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      Nincs elérhető bevásárlólista
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={isMobile ? 12 : 8} sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: { xs: 2, sm: 0 }
                }}>
                  {isMobile && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCategoryDrawerToggle}
                      sx={{ flex: '1 1 auto', minWidth: isSmallMobile ? '100%' : 'auto' }}
                    >
                      Kategóriák
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDrawerToggle}
                    disabled={!selectedListId}
                    sx={{ flex: '1 1 auto', minWidth: isSmallMobile ? '100%' : 'auto' }}
                  >
                    Saját termék hozzáadása
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Fő tartalom: Katalógus böngésző és kategória szűrő */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <CategorySelector 
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </Grid>
          )}
          
          <Grid item xs={12} md={!isMobile ? 9 : 12}>
            <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ mb: 2 }}>
                <Tabs 
                  value={selectedTab} 
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons={isMobile ? "auto" : false}
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
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Kategóriák böngészése
                  </Typography>
                  <Typography>
                    Itt lesz majd a kategóriák részletes böngészése.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Termék részletek dialógus */}
      <Dialog
        open={productDialogOpen}
        onClose={handleCloseProductDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            onClick={handleCloseProductDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
      >
        {drawerContent}
      </Drawer>

      {/* Fiók a kategóriákhoz (csak mobilon) */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'left'}
        open={categoryDrawerOpen}
        onClose={handleCategoryDrawerToggle}
      >
        {categoryDrawerContent}
      </Drawer>
    </Box>
  );
};

export default ProductCatalogPage; 