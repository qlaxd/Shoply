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
  Chip,
  Drawer,
  useMediaQuery
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
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Fiók tartalom
  const drawerContent = (
    <Box sx={{ width: isMobile ? '100vw' : 300, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Termék hozzáadása</Typography>
        <IconButton onClick={handleDrawerToggle}>
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Termékkatalógus
        </Typography>
        
        {/* Fő tartalom */}
        <Grid container spacing={3}>
          {/* Listák kiválasztása és termék hozzáadási gomb */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">
                    Aktív bevásárlólista:
                  </Typography>
                  {loading ? (
                    <Loader size={24} />
                  ) : lists.length > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <select
                        value={selectedListId || ''}
                        onChange={handleListChange}
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          width: '100%',
                          fontSize: '1rem'
                        }}
                      >
                        {lists.map(list => (
                          <option key={list._id} value={list._id}>
                            {list.title}
                          </option>
                        ))}
                      </select>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      Nincs elérhető bevásárlólista
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDrawerToggle}
                    disabled={!selectedListId}
                  >
                    Saját termék hozzáadása
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Fő tartalom: Katalógus böngésző és kategória szűrő */}
          <Grid item xs={12} md={3}>
            <CategorySelector 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Tabs 
                  value={selectedTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab 
                    label="Termékkatalógus" 
                    icon={<InventoryIcon />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="Kategóriák" 
                    icon={<CategoryIcon />} 
                    iconPosition="start"
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
    </Box>
  );
};

export default ProductCatalogPage; 