import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  InputAdornment,
  Slider,
  ListItemIcon,
  Checkbox,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse,
  Zoom,
  Badge,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TitleIcon from '@mui/icons-material/Title';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate, useParams } from 'react-router-dom';

// Common komponensek importálása
import Button from '../../common/Button';
import Input from '../../common/Input';
import Modal from '../../common/Modal';
import Loader from '../../common/Loader';

// Services importálása
import ListService from '../../../services/list.service';
import ProductCatalogService from '../../../services/productCatalog.service';
import CategoryService from '../../../services/category.service';

const ListEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewList = id === 'new';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Állapotok
  const [listTitle, setListTitle] = useState('');
  const [priority, setPriority] = useState(3);
  const [newProduct, setNewProduct] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState(1);
  const [newProductNotes, setNewProductNotes] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!isNewList);
  const [saving, setSaving] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Felhasználói adatok
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  // Létező lista adatainak betöltése
  useEffect(() => {
    const fetchListData = async () => {
      if (!isNewList) {
        try {
          setLoading(true);
          setError(null);
          
          const listData = await ListService.getListById(id);
          
          if (listData && listData._id) {
            setListTitle(listData.title || '');
            setPriority(listData.priority || 3);
            
            // Ha a products egy tömb objektumokkal
            if (Array.isArray(listData.products)) {
              setProducts(listData.products.map(product => ({
                id: product._id || product.id,
                name: product.name,
                addedBy: product.addedBy || 'Ismeretlen',
                isPurchased: product.isPurchased || false,
                category: product.category || null
              })));
            } else {
              setProducts([]);
            }
          } else {
            throw new Error('Érvénytelen lista adat érkezett a szerverről');
          }
        } catch (err) {
          console.error('Hiba a lista betöltésekor:', err);
          setError('Nem sikerült betölteni a lista adatait: ' + (err.message || 'Ismeretlen hiba'));
        } finally {
          setLoading(false);
        }
      }
    };

    // Kategóriák betöltése
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoryService.getAllCategories();
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Hiba a kategóriák betöltésekor:', err);
      }
    };

    fetchListData();
    fetchCategories();
  }, [id, isNewList]);

  // Számoljuk a teljesítés százalékát
  useEffect(() => {
    if (products.length > 0) {
      const purchasedCount = products.filter(p => p.isPurchased).length;
      setCompletionPercentage(Math.round((purchasedCount / products.length) * 100));
    } else {
      setCompletionPercentage(0);
    }
  }, [products]);

  // Termék keresés a katalógusban
  const handleProductSearch = async (query) => {
    if (query.trim().length >= 1) {
      try {
        setSearching(true);
        setError(null);
        
        const results = await ProductCatalogService.searchCatalogItems(query);
        
        if (Array.isArray(results)) {
          setSearchResults(results.map(item => ({
            id: item._id || item.id,
            name: item.name,
            category: item.category || null
          })));
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Hiba a termékek keresésekor:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Termék hozzáadása
  const handleAddProduct = async () => {
    if (newProduct.trim()) {
      try {
        setError(null);
        const newProductObj = {
          name: newProduct,
          addedBy: username || 'Felhasználó',
          isPurchased: false,
          category: selectedCategory,
          quantity: newProductQuantity,
          notes: newProductNotes
        };
        
        if (!isNewList) {
          // Létező listához adjuk a terméket
          const addedProductResponse = await ListService.addProductToList(id, newProductObj);
          
          if (addedProductResponse && (addedProductResponse._id || addedProductResponse.id)) {
            // Ha a backend visszaadta a teljes terméket
            const addedProduct = {
              id: addedProductResponse._id || addedProductResponse.id,
              name: addedProductResponse.name || newProduct,
              addedBy: addedProductResponse.addedBy || username || 'Felhasználó',
              isPurchased: addedProductResponse.isPurchased || false,
              category: addedProductResponse.category || selectedCategory,
              quantity: addedProductResponse.quantity || newProductQuantity,
              notes: addedProductResponse.notes || newProductNotes
            };
            
            setProducts(prevProducts => [...prevProducts, addedProduct]);
          } else {
            // Ha a backend nem adott vissza valid terméket, de a kérés sikeres volt
            // Helyi állapotba helyezzük az új terméket ideiglenes ID-val
            setProducts(prevProducts => [...prevProducts, { 
              id: `temp-${Date.now()}`, 
              ...newProductObj 
            }]);
          }
        } else {
          // Új lista esetén csak lokálisan tároljuk, amíg nem mentjük a listát
          setProducts(prevProducts => [...prevProducts, { 
            id: `temp-${Date.now()}`,
            ...newProductObj 
          }]);
        }
        
        // Termék hozzáadása után töröljük a beviteli mezőket és keresési eredményeket
        setNewProduct('');
        setNewProductQuantity(1);
        setNewProductNotes('');
        setSearchResults([]);
        setSelectedCategory(null);
      } catch (err) {
        console.error('Hiba a termék hozzáadásakor:', err);
        setError('Nem sikerült hozzáadni a terméket: ' + (err.message || 'Ismeretlen hiba'));
      }
    }
  };

  // Termék törlése
  const handleDeleteProduct = async (productId) => {
    try {
      setError(null);
      
      if (!isNewList && !productId.toString().startsWith('temp-')) {
        // Csak akkor hívunk API-t, ha már mentett listáról van szó és nem ideiglenes termék ID
        await ListService.removeProductFromList(id, productId);
      }
      
      // Mindenképp frissítjük a helyi állapotot
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      console.error('Hiba a termék törlésekor:', err);
      setError('Nem sikerült törölni a terméket: ' + (err.message || 'Ismeretlen hiba'));
    }
  };

  // Termék adatainak módosítása
  const handleUpdateProduct = async (productId) => {
    try {
      if (!editingProduct) return;
      
      const updatedProductData = {
        quantity: editingProduct.quantity,
        notes: editingProduct.notes
      };
      
      if (!isNewList) {
        await ListService.updateProductInList(id, productId, updatedProductData);
      }
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, ...updatedProductData } 
            : p
        )
      );
      
      setEditingProduct(null);
    } catch (err) {
      console.error('Hiba a termék módosításakor:', err);
      setError('Nem sikerült módosítani a terméket: ' + (err.message || 'Ismeretlen hiba'));
    }
  };

  // Termék szerkesztés megnyitása
  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      quantity: product.quantity || 1,
      notes: product.notes || ''
    });
  };

  // Termék részletek megjelenítésének váltása
  const toggleProductDetails = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // Lista mentés előtti ellenőrzés
  const handleSave = () => {
    if (products.length === 0) {
      setError('Legalább egy terméket hozzá kell adni a listához');
      return;
    }
    
    if (!listTitle.trim()) {
      setSaveDialogOpen(true);
      return;
    }
    
    saveList();
  };

  // Lista mentése
  const saveList = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
      if (!userId) {
        setError('Listát csak bejelentkezett felhasználó hozhat létre vagy módosíthat.');
        setSaving(false);
        return;
      }
      
      const listData = {
        title: listTitle.trim(),
        priority: priority,
        products: products.map(p => ({ 
          name: p.name, 
          addedBy: p.addedBy || username || 'Felhasználó',
          isPurchased: p.isPurchased || false,
          category: p.category,
          quantity: p.quantity || 1,
          notes: p.notes || ''
        })),
        owner: userId
      };
      
      if (isNewList) {
        await ListService.createList(listData);
      } else {
        await ListService.updateList(id, listData);
      }
      
      // Sikeres mentés után navigáljunk vissza a listákhoz
      navigate('/');
    } catch (err) {
      console.error(`Hiba a lista ${isNewList ? 'létrehozásakor' : 'frissítésekor'}:`, err);
      
      // Részletesebb hibaüzenet megjelenítése
      if (err.response?.data?.error?.message) {
        setError(`Nem sikerült ${isNewList ? 'létrehozni' : 'frissíteni'} a listát: ${err.response.data.error.message}`);
      } else if (err.message) {
        setError(`Nem sikerült ${isNewList ? 'létrehozni' : 'frissíteni'} a listát: ${err.message}`);
      } else {
        setError(`Nem sikerült ${isNewList ? 'létrehozni' : 'frissíteni'} a listát. Ellenőrizd, hogy be vagy-e jelentkezve.`);
      }
    } finally {
      setSaving(false);
    }
  };

  // Dialógusban a mentés kezelése
  const handleDialogSave = () => {
    if (listTitle.trim()) {
      setSaveDialogOpen(false);
      saveList();
    } else {
      setError('A lista címét meg kell adni');
    }
  };

  // Prioritás jelölők
  const priorityMarks = [
    { value: 1, label: 'Magas' },
    { value: 2, label: 'Közepes' },
    { value: 3, label: 'Alacsony' }
  ];

  // Prioritás színének meghatározása
  const getPriorityColor = (value) => {
    switch(value) {
      case 1: return theme.palette.error.main;
      case 2: return theme.palette.warning.main;
      case 3: return theme.palette.info.main;
      default: return theme.palette.info.main;
    }
  };

  // Kategória kiválasztása
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryInfo(true);
    setTimeout(() => setShowCategoryInfo(false), 3000);
  };

  // Termék vásárlási állapotának módosítása
  const handleToggleProduct = async (productId) => {
    try {
      // Keressük meg a terméket az aktuális termékek között
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      // Ellenkező állapotba állítjuk
      const newIsPurchased = !product.isPurchased;
      
      // Ha már létező lista, akkor küldjük a kérést a backendre
      if (!isNewList) {
        await ListService.updateProductInList(id, productId, { isPurchased: newIsPurchased });
      }
      
      // Frissítjük a helyi állapotot
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, isPurchased: newIsPurchased } 
            : p
        )
      );
    } catch (err) {
      console.error('Hiba a termék állapotának módosításakor:', err);
      setError('Nem sikerült módosítani a termék állapotát: ' + (err.message || 'Ismeretlen hiba'));
    }
  };

  // Minden termék megvásárlása/visszaállítása
  const handleToggleAllProducts = (isPurchased) => {
    try {
      // Frissítjük a helyi állapotot
      setProducts(prevProducts => 
        prevProducts.map(product => ({ ...product, isPurchased }))
      );
      
      // Ha létező lista, akkor küldjük a kérést a backendre minden termékre
      if (!isNewList) {
        products.forEach(async (product) => {
          if (product.isPurchased !== isPurchased && !product.id.toString().startsWith('temp-')) {
            await ListService.updateProductInList(id, product.id, { isPurchased });
          }
        });
      }
    } catch (err) {
      console.error('Hiba a termékek állapotának módosításakor:', err);
      setError('Nem sikerült módosítani a termékek állapotát: ' + (err.message || 'Ismeretlen hiba'));
    }
  };

  // Betöltési állapot megjelenítése
  if (loading) {
    return <Loader text="Lista betöltése..." fullPage={true} />;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 4, 
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
            <IconButton 
              onClick={() => navigate('/')} 
              color="primary" 
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                flexGrow: 1,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {isNewList ? 'Új bevásárlólista' : listTitle}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            mt: { xs: 2, sm: 0 },
            ml: { xs: 0, sm: 'auto' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            {completionPercentage > 0 && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 1.5,
                py: 0.5
              }}>
                <CircularProgress 
                  variant="determinate" 
                  value={completionPercentage} 
                  size={24} 
                  sx={{ 
                    color: completionPercentage === 100 ? 'success.main' : 'primary.main',
                    mr: 1
                  }}
                />
                <Typography variant="body2" component="div">
                  {completionPercentage}% kész
                </Typography>
              </Box>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading || saving || !listTitle.trim()}
              sx={{ 
                flexGrow: { xs: 1, sm: 0 },
                borderRadius: 8,
                boxShadow: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              {saving ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Mentés...
                </>
              ) : 'Mentés'}
            </Button>
          </Box>
        </Box>
        
        {/* Hibaüzenet megjelenítése */}
        {error && (
          <Fade in={!!error}>
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', borderRadius: 2, boxShadow: 2 }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          </Fade>
        )}

        {/* Lista adatok szerkesztése */}
        <Paper sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          boxShadow: 3,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 5
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TitleIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">Lista adatai</Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Input
            fullWidth
            label="Lista Címe"
            variant="outlined"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            placeholder="Adj címet a listának (pl. Hétvégi grillparti)"
            sx={{ 
              mb: 3, 
              '& .MuiInputBase-root': {
                borderRadius: 2
              }
            }}
          />
          
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PriorityHighIcon sx={{ mr: 1, color: getPriorityColor(priority) }} />
              Prioritás: {priorityMarks.find(mark => mark.value === priority)?.label}
            </Typography>
            <Box sx={{ px: 2, mb: 3 }}>
              <Slider
                value={priority}
                min={1}
                max={3}
                step={1}
                marks={priorityMarks}
                onChange={(_, newValue) => setPriority(newValue)}
                valueLabelDisplay="off"
                sx={{
                  '& .MuiSlider-markLabel': {
                    fontSize: '0.8rem',
                  },
                  '& .MuiSlider-thumb': {
                    backgroundColor: getPriorityColor(priority),
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: getPriorityColor(priority),
                  }
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Termékek kezelése */}
        <Paper sx={{ 
          p: 3, 
          borderRadius: 2,
          boxShadow: 3,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 5
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Termékek</Typography>
            </Box>
            
            {products.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Minden termék megvásárolva">
                  <IconButton 
                    color="success" 
                    onClick={() => handleToggleAllProducts(true)}
                    size="small"
                  >
                    <DoneAllIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Minden termék visszaállítása">
                  <IconButton 
                    color="warning" 
                    onClick={() => handleToggleAllProducts(false)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Input
                  fullWidth
                  variant="outlined"
                  placeholder="Új termék hozzáadása..."
                  value={newProduct}
                  onChange={(e) => {
                    setNewProduct(e.target.value);
                    handleProductSearch(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newProduct.trim()) {
                      e.preventDefault();
                      handleAddProduct();
                    }
                  }}
                  sx={{ 
                    '& .MuiInputBase-root': {
                      borderRadius: 8
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Mennyiség"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  value={newProductQuantity}
                  onChange={(e) => setNewProductQuantity(parseInt(e.target.value) || 1)}
                  sx={{ 
                    '& .MuiInputBase-root': {
                      borderRadius: 8
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Megjegyzés"
                  value={newProductNotes}
                  onChange={(e) => setNewProductNotes(e.target.value)}
                  sx={{ 
                    '& .MuiInputBase-root': {
                      borderRadius: 8
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  onClick={handleAddProduct}
                  disabled={!newProduct.trim()}
                  sx={{ 
                    color: 'primary.main',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          
          {categories.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              width: '100%',
              mb: 3
            }}>
              {categories.slice(0, isMobile ? 3 : 5).map((category) => (
                <Chip
                  key={category._id}
                  label={category.name}
                  onClick={() => handleCategorySelect(category)}
                  color={selectedCategory?._id === category._id ? 'primary' : 'default'}
                  variant={selectedCategory?._id === category._id ? 'filled' : 'outlined'}
                  sx={{ 
                    transition: 'all 0.2s',
                    transform: selectedCategory?._id === category._id ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              ))}
              
              {categories.length > (isMobile ? 3 : 5) && (
                <Tooltip title="További kategóriák">
                  <Chip 
                    icon={<HelpOutlineIcon />} 
                    label={`+${categories.length - (isMobile ? 3 : 5)}`} 
                    variant="outlined" 
                  />
                </Tooltip>
              )}
            </Box>
          )}
          
          <Collapse in={showCategoryInfo}>
            <Paper sx={{ mb: 2, p: 1.5, bgcolor: 'info.light', borderRadius: 2 }}>
              <Typography variant="body2">
                A termék a következő kategóriába lesz sorolva: <strong>{selectedCategory?.name}</strong>
              </Typography>
            </Paper>
          </Collapse>
          
          {/* Keresési találatok megjelenítése */}
          {searchResults.length > 0 && (
            <Paper elevation={3} sx={{ 
              mb: 3, 
              maxHeight: 200, 
              overflow: 'auto',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <List dense>
                {searching ? (
                  <ListItem>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <ListItemText primary="Keresés folyamatban..." />
                  </ListItem>
                ) : (
                  searchResults.map(item => (
                    <ListItem
                      key={item.id}
                      button
                      onClick={() => {
                        setNewProduct(item.name);
                        setSelectedCategory(item.category);
                        setSearchResults([]);
                      }}
                      sx={{
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText 
                        primary={item.name} 
                        secondary={item.category?.name ? `Kategória: ${item.category.name}` : null}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          )}
          
          {/* Termékek listája */}
          {products.length > 0 ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1,
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Termék neve
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 4 }}>
                    Mennyiség
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 8 }}>
                    Hozzáadta
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 4 }}>
                    Műveletek
                  </Typography>
                </Box>
              </Box>
              
              <List sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                {products.map((product, index) => (
                  <React.Fragment key={product.id || index}>
                    <Fade 
                      in={true} 
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      <ListItem 
                        dense
                        sx={{ 
                          borderBottom: index < products.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          transition: 'all 0.2s',
                          bgcolor: product.isPurchased ? 'action.selected' : 'background.paper',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={product.isPurchased || false}
                            onChange={() => handleToggleProduct(product.id)}
                            sx={{ 
                              color: product.isPurchased ? 'success.main' : 'action.active',
                              '&.Mui-checked': {
                                color: 'success.main'
                              }
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography 
                                variant="body1"
                                sx={{ 
                                  textDecoration: product.isPurchased ? 'line-through' : 'none',
                                  color: product.isPurchased ? 'text.disabled' : 'text.primary',
                                  mr: 1
                                }}
                              >
                                {product.name}
                              </Typography>
                              {product.category && (
                                <Chip 
                                  label={product.category.name} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                              {product.notes && (
                                <Tooltip title={product.notes}>
                                  <CommentIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary' }} />
                                </Tooltip>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                                {product.quantity || 1} db
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {typeof product.addedBy === 'object' ? product.addedBy.username : product.addedBy || 'Ismeretlen'}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex' }}>
                            <IconButton 
                              edge="end" 
                              onClick={() => toggleProductDetails(product.id)}
                              sx={{ mr: 1 }}
                            >
                              {expandedProductId === product.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleDeleteProduct(product.id)}
                              sx={{ 
                                color: 'error.light',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  color: 'error.main',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Fade>

                    <Collapse in={expandedProductId === product.id}>
                      <Box sx={{ 
                        p: 2, 
                        pl: 9, 
                        bgcolor: 'action.hover',
                        borderBottom: index < products.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}>
                        {editingProduct && editingProduct.id === product.id ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                label="Mennyiség"
                                type="number"
                                InputProps={{ inputProps: { min: 1 } }}
                                value={editingProduct.quantity}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  quantity: parseInt(e.target.value) || 1
                                })}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                label="Megjegyzések"
                                value={editingProduct.notes}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  notes: e.target.value
                                })}
                                size="small"
                                multiline
                                rows={2}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleUpdateProduct(product.id)}
                                sx={{ mr: 1 }}
                              >
                                Mentés
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => setEditingProduct(null)}
                              >
                                Mégsem
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="subtitle2">Mennyiség:</Typography>
                              <Typography>{product.quantity || 1} db</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Megjegyzések:</Typography>
                              <Typography>{product.notes || 'Nincs megjegyzés'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleEditProduct(product)}
                                startIcon={<EditIcon />}
                              >
                                Szerkesztés
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                mt: 2 
              }}>
                <Badge 
                  badgeContent={products.length} 
                  color="primary"
                  showZero
                  sx={{ mr: 2 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Összes termék
                  </Typography>
                </Badge>
                <Badge 
                  badgeContent={products.filter(p => p.isPurchased).length} 
                  color="success"
                  showZero
                >
                  <Typography variant="body2" color="text.secondary">
                    Megvásárolva
                  </Typography>
                </Badge>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}>
              <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="body1" color="textSecondary">
                Adj hozzá termékeket a listához!
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Használd a fenti mezőt termékek hozzáadásához.
              </Typography>
            </Box>
          )}
        </Paper>
        
        {/* Címbekérő modális ablak */}
        <Modal
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          title="Adj címet a listának"
          description="A lista mentéséhez adj meg egy címet, ami alapján később könnyen azonosítható lesz."
          actions={
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setSaveDialogOpen(false)}
                sx={{ borderRadius: 8 }}
              >
                Mégsem
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogSave}
                disabled={!listTitle.trim()}
                sx={{ borderRadius: 8 }}
              >
                Mentés
              </Button>
            </>
          }
        >
          <Input
            autoFocus
            fullWidth
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            label="Lista címe"
            placeholder="Pl. Hétvégi grillparti"
            sx={{ 
              mt: 2,
              '& .MuiInputBase-root': {
                borderRadius: 2
              }
            }}
          />
        </Modal>
      </Container>
    </>
  );
};

export default ListEditor; 