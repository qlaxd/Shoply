import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse,
  TextField,
  Grid,
  SwipeableDrawer,
  Fab,
  LinearProgress,
  ButtonGroup,
  Button,
  ListItemButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TitleIcon from '@mui/icons-material/Title';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useNavigate, useParams } from 'react-router-dom';

// Common komponensek importálása
import Input from '../../common/Input';
import Modal from '../../common/Modal';
import Loader from '../../common/Loader';

// Services importálása
import ListService from '../../../services/list.service';
import ProductCatalogService from '../../../services/productCatalog.service';
import CategoryService from '../../../services/category.service';
import { FeaturedPlayList } from '@mui/icons-material';

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
  const [newProductUnit, setNewProductUnit] = useState('db');
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
  const [userPermission, setUserPermission] = useState('edit'); // Default to edit permission
  
  // Mobile-specific states
  const [addProductDrawerOpen, setAddProductDrawerOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [mobileProductFilter, setMobileProductFilter] = useState('all'); // 'all', 'pending', 'completed'
  
  // Felhasználói adatok
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  // Ellenőrizzük, hogy a felhasználónak van-e szerkesztési joga
  const canEdit = userPermission !== 'view';

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
            
            // A felhasználó jogosultságának beállítása
            if (listData.userPermission) {
              setUserPermission(listData.userPermission);
            } else if (listData.owner && listData.owner === userId) {
              setUserPermission('owner');
            } else if (listData.sharedUsers && Array.isArray(listData.sharedUsers)) {
              // Ellenőrizzük a megosztási jogosultságot
              const userShare = listData.sharedUsers.find(share => share.userId === userId);
              if (userShare) {
                setUserPermission(userShare.permission || 'view');
              }
            }
            
            // Ha a products egy tömb objektumokkal
            if (Array.isArray(listData.products)) {
              setProducts(listData.products.map(product => ({
                id: product._id || product.id,
                name: product.name,
                addedBy: product.addedBy,
                isPurchased: product.isPurchased || false,
                category: product.category || null,
                quantity: product.quantity,
                unit: product.unit || 'db',
                notes: product.notes
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
  }, [id, isNewList, userId]);

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
          // Process the search results
          const processedResults = results.map(item => {
            // Find the matching category in the loaded categories
            let categoryObj = item.category;
            
            // If category is an ID (not an object), find the full category object
            if (categoryObj && typeof categoryObj === 'string') {
              const matchingCategory = categories.find(cat => cat._id === categoryObj);
              if (matchingCategory) {
                categoryObj = matchingCategory;
              }
            } 
            // If we have categories loaded and the category has an ID, try to match exactly
            else if (categoryObj && categoryObj._id && categories.length > 0) {
              const matchingCategory = categories.find(cat => cat._id === categoryObj._id);
              if (matchingCategory) {
                categoryObj = matchingCategory;
              }
            }
            
            return {
              id: item._id || item.id,
              name: item.name,
              category: categoryObj,
              unit: item.defaultUnit || 'db'
            };
          });
          
          setSearchResults(processedResults);
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
    if (!canEdit) {
      setError('Nincs jogosultságod termék hozzáadásához.');
      return;
    }
    
    if (newProduct.trim()) {
      try {
        setError(null);
        const newProductObj = {
          name: newProduct,
          addedBy: {
            _id: userId,
            username: username || 'Felhasználó'
          },
          isPurchased: false,
          category: selectedCategory,
          quantity: newProductQuantity,
          unit: newProductUnit,
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
              addedBy: addedProductResponse.addedBy || {
                _id: userId,
                username: username || 'Felhasználó'
              },
              isPurchased: addedProductResponse.isPurchased || false,
              category: addedProductResponse.category || selectedCategory,
              quantity: addedProductResponse.quantity || newProductQuantity,
              unit: addedProductResponse.unit || newProductUnit,
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
        setNewProductUnit('db');
        setNewProductNotes('');
        setSearchResults([]);
        handleCategorySelect(null);
      } catch (err) {
        console.error('Hiba a termék hozzáadásakor:', err);
        setError('Nem sikerült hozzáadni a terméket: ' + (err.message || 'Ismeretlen hiba'));
      }
    }
  };

  // Termék törlése
  const handleDeleteProduct = async (productId) => {
    if (!canEdit) {
      setError('Nincs jogosultságod termék törléséhez.');
      return;
    }
    
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
    if (!canEdit) {
      setError('Nincs jogosultságod termék módosításához.');
      return;
    }
    
    try {
      if (!editingProduct) return;
      
      const updatedProductData = {
        quantity: editingProduct.quantity,
        unit: editingProduct.unit || 'db',
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
    if (!canEdit) {
      setError('Nincs jogosultságod termék szerkesztéséhez.');
      return;
    }
    
    setEditingProduct({
      ...product,
      quantity: product.quantity || 1,
      unit: product.unit || 'db',
      notes: product.notes || ''
    });
  };

  // Termék részletek megjelenítésének váltása
  const toggleProductDetails = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // Lista mentés előtti ellenőrzés
  const handleSave = () => {
    if (!canEdit) {
      setError('Nincs jogosultságod a lista módosításához.');
      return;
    }
    
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
        products: products.map(p => {
          
          // If addedBy is an object with _id, just send the _id reference
          // This matches MongoDB's expected format for references
          const addedByValue = p.addedBy && typeof p.addedBy === 'object' && p.addedBy._id 
            ? p.addedBy._id  // Send just the ID
            : p.addedBy;     // Keep as is if not an object with _id
          
          return { 
            name: p.name, 
            addedBy: addedByValue,
            isPurchased: p.isPurchased || false,
            category: p.category,
            quantity: p.quantity,
            unit: p.unit || 'db',
            notes: p.notes
          };
        })
      };
      
      // Only set owner for new lists
      if (isNewList) {
        listData.owner = userId;
      }
      
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
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setShowCategoryInfo(true);
    setTimeout(() => setShowCategoryInfo(false), 3000);
  }, []);

  // Mobile drawer handlers - consolidate these functions
  const toggleAddProductDrawer = useCallback(() => {
    setAddProductDrawerOpen(prev => !prev);
  }, []);

  const toggleActionMenu = useCallback(() => {
    setActionMenuOpen(prev => !prev);
  }, []);

  // Mobile filter products
  const handleFilterProducts = useCallback((filterType) => {
    setMobileProductFilter(filterType);
  }, []);

  // Termék vásárlási állapotának módosítása
  const handleToggleProduct = async (productId) => {
    if (!canEdit) {
      setError('Nincs jogosultságod a termék állapotának módosításához.');
      return;
    }
    
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
    if (!canEdit) {
      setError('Nincs jogosultságod a termékek állapotának módosításához.');
      return;
    }
    
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

  // Get filtered products
  const filteredProducts = mobileProductFilter === 'all' 
    ? products 
    : mobileProductFilter === 'pending' 
      ? products.filter(p => !p.isPurchased) 
      : products.filter(p => p.isPurchased);

  // Betöltési állapot megjelenítése
  if (loading) {
    return <Loader text="Lista betöltése..." fullPage={true} />;
  }

  return (
    <>
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 2, 
          mb: { xs: 10, sm: 8 }, // Add bottom margin on mobile for FAB
          px: { xs: 1, sm: 2, md: 3 } // Reduce padding on mobile
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: { xs: 2, sm: 4 }, 
          gap: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            justifyContent: 'space-between'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              minWidth: 0, // Add this to allow proper text truncation
              flex: 1, // Allow this box to grow and shrink
            }}>
              <IconButton 
                onClick={() => navigate('/')} 
                color="primary" 
                sx={{ mr: 1, flexShrink: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2rem' },
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  background: isMobile ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 'none',
                  backgroundClip: isMobile ? 'text' : 'unset',
                  WebkitBackgroundClip: isMobile ? 'text' : 'unset',
                  maxWidth: { xs: isMobile && !canEdit ? 'calc(100% - 20px)' : '100%' },
                  minWidth: 0, // Allow text to shrink below its content size
                }}
              >
                {isNewList ? 'Új bevásárlólista' : listTitle}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexShrink: 0, // Prevent this area from shrinking
              ml: 1, // Add margin to separate from title
            }}>
              {!canEdit && !isNewList && (
                <Chip 
                  label="Csak megtekintés" 
                  size="small" 
                  color="secondary" 
                  sx={{ fontSize: '0.7rem', mr: isMobile ? 1 : 0 }}
                />
              )}
              
              {isMobile && (
                <IconButton
                  aria-label="További műveletek"
                  onClick={toggleActionMenu}
                  color="primary"
                  sx={{ p: 1 }} // Reduce padding on mobile
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: { xs: 2, sm: 0 },
              ml: { xs: 0, sm: 'auto' },
            }}>
              {completionPercentage > 0 && (
                <Paper 
                  elevation={1}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mr: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5
                  }}
                >
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
                </Paper>
              )}
              
              {canEdit && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading || saving || !listTitle.trim() || products.length === 0}
                  sx={{ 
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
              )}
            </Box>
          )}
        </Box>
        
        {/* Progress bar on mobile */}
        {isMobile && completionPercentage > 0 && (
          <Box sx={{ 
            mb: 3, 
            px: 1, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary" component="div">Haladás:</Typography>
              <Typography variant="body2" fontWeight="bold" color={
                completionPercentage === 100 ? 'success.main' : 'primary.main'
              } component="div">
                {completionPercentage}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ 
                width: '100%', 
                height: 8, 
                borderRadius: 4,
                bgcolor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  bgcolor: completionPercentage === 100 ? 'success.main' : 'primary.main',
                  borderRadius: 4
                }
              }} 
            />
          </Box>
        )}
        
        {/* Hibaüzenet megjelenítése */}
        {error && (
          <Fade in={!!error}>
            <Paper sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              mb: 3, 
              bgcolor: 'error.light', 
              borderRadius: { xs: 3, sm: 2 }, 
              boxShadow: 2,
              mx: { xs: 1, sm: 0 }
            }}>
              <Typography variant="body2" color="error" component="div" sx={{ fontWeight: 'medium' }}>{error}</Typography>
            </Paper>
          </Fade>
        )}

        {/* Lista adatok szerkesztése */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: { xs: 3, sm: 2 },
          boxShadow: { xs: 1, sm: 3 },
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 5
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FeaturedPlayList color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Lista adatai
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Input
            fullWidth
            label="Lista Címe"
            variant="outlined"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            placeholder="Adj címet a listának (pl. Hétvégi grillparti)"
            disabled={!canEdit}
            sx={{ 
              mb: 3, 
              '& .MuiInputBase-root': {
                borderRadius: { xs: 4, sm: 2 },
                fontSize: { xs: '0.95rem', sm: '1rem' }
              }
            }}
          />
          
          <Box sx={{ mb: 2 }}>
            <Typography 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              <PriorityHighIcon sx={{ mr: 1, color: getPriorityColor(priority) }} />
              Prioritás: <Box component="span" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                {priorityMarks.find(mark => mark.value === priority)?.label}
              </Box>
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
                disabled={!canEdit}
                sx={{
                  '& .MuiSlider-markLabel': {
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  },
                  '& .MuiSlider-thumb': {
                    backgroundColor: getPriorityColor(priority),
                    width: { xs: 16, sm: 20 },
                    height: { xs: 16, sm: 20 },
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: getPriorityColor(priority),
                    height: { xs: 6, sm: 4 }
                  },
                  '& .MuiSlider-rail': {
                    height: { xs: 6, sm: 4 }
                  }
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Termékek kezelése */}
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: { xs: 3, sm: 2 },
          boxShadow: { xs: 1, sm: 3 },
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 5
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2, 
            flexWrap: { xs: 'wrap', sm: 'nowrap' } 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 }
            }}>
              <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
              <Typography 
                variant="h6" 
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Termékek {isMobile && `(${filteredProducts.length})`}
              </Typography>
            </Box>
            
            {isMobile && products.length > 0 && (
              <Box sx={{ width: '100%', mb: 1 }}>
                <ButtonGroup 
                  variant="outlined" 
                  size="small" 
                  sx={{ width: '100%' }}
                >
                  <Button 
                    onClick={() => handleFilterProducts('all')}
                    sx={{ 
                      flex: 1, 
                      color: mobileProductFilter === 'all' ? 'primary.main' : 'text.secondary',
                      borderColor: mobileProductFilter === 'all' ? 'primary.main' : 'divider',
                      bgcolor: mobileProductFilter === 'all' ? 'primary.lighter' : 'transparent',
                    }}
                  >
                    Összes
                  </Button>
                  <Button 
                    onClick={() => handleFilterProducts('pending')}
                    sx={{ 
                      flex: 1,
                      color: mobileProductFilter === 'pending' ? 'warning.main' : 'text.secondary',
                      borderColor: mobileProductFilter === 'pending' ? 'warning.main' : 'divider',
                      bgcolor: mobileProductFilter === 'pending' ? 'warning.lighter' : 'transparent',
                    }}
                  >
                    Teendő
                  </Button>
                  <Button 
                    onClick={() => handleFilterProducts('completed')}
                    sx={{ 
                      flex: 1,
                      color: mobileProductFilter === 'completed' ? 'success.main' : 'text.secondary',
                      borderColor: mobileProductFilter === 'completed' ? 'success.main' : 'divider',
                      bgcolor: mobileProductFilter === 'completed' ? 'success.lighter' : 'transparent',
                    }}
                  >
                    Kész
                  </Button>
                </ButtonGroup>
              </Box>
            )}
            
            {products.length > 0 && canEdit && !isMobile && (
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
          
          {canEdit && !isMobile && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Egység"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    sx={{ 
                      '& .MuiInputBase-root': {
                        borderRadius: 8
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12} sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {/* Desktop "Add Product" button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddProduct()}
                    disabled={!newProduct.trim()}
                    startIcon={<AddIcon />}
                    sx={{ 
                      borderRadius: 8,
                      px: 3
                    }}
                  >
                    Termék hozzáadása
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Mobilon a kategória választó egyszerűbben jelenik meg */}
          
          <Collapse in={showCategoryInfo}>
            <Paper sx={{ mb: 2, p: 1.5, bgcolor: 'info.light', borderRadius: 2 }}>
              <Typography variant="body2" component="div">
                A termék a következő kategóriába lesz sorolva: <strong>{selectedCategory?.name}</strong>
              </Typography>
            </Paper>
          </Collapse>
          
          {/* Keresési találatok megjelenítése */}
          {searchResults.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ mb: 1 }}>
                Találatok:
              </Typography>
              <Paper elevation={0} variant="outlined" sx={{ 
                maxHeight: 200, 
                overflow: 'auto',
                borderRadius: 2
              }}>
                <List dense>
                  {searching ? (
                    <ListItem>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <ListItemText primary="Keresés folyamatban..." />
                    </ListItem>
                  ) : (
                    searchResults.map(item => (
                      <ListItemButton
                        key={item.id}
                        onClick={() => {
                          setNewProduct(item.name);
                          handleCategorySelect(item.category);
                          setNewProductUnit(item.unit || 'db');
                          setSearchResults([]);
                        }}
                      >
                        <ListItemText 
                          primary={<Typography component="span">{item.name}</Typography>}
                          secondary={`${item.unit || 'db'}`}
                        />
                      </ListItemButton>
                    ))
                  )}
                </List>
              </Paper>
            </Box>
          )}
          
          {/* Termékek listája */}
          {products.length > 0 ? (
            <>
              {!isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1,
                  pb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="subtitle2" color="text.secondary" component="div">
                    Termék neve
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ mr: 4 }}>
                      Mennyiség
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ mr: 8 }}>
                      Hozzáadta
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div" sx={{ mr: 4 }}>
                      Műveletek
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <List sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                {filteredProducts.map((product, index) => (
                  <React.Fragment key={product.id || index}>
                    <Fade 
                      in={true} 
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      <ListItem 
                        dense
                        sx={{ 
                          borderBottom: index < filteredProducts.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          transition: 'all 0.2s',
                          bgcolor: product.isPurchased 
                            ? 'action.selected' 
                            : 'background.paper',
                          borderRadius: isMobile && index === 0 ? '8px 8px 0 0' : 
                                        isMobile && index === filteredProducts.length - 1 ? '0 0 8px 8px' : 0,
                          '&:hover': {
                            bgcolor: 'action.hover'
                          },
                          py: isMobile ? 1.5 : 1
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
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              flexWrap: 'wrap',
                              width: '100%',
                              maxWidth: { xs: '80%', sm: '100%' }
                            }}>
                              <Typography 
                                variant="body1"
                                component="span"
                                sx={{ 
                                  textDecoration: product.isPurchased ? 'line-through' : 'none',
                                  color: product.isPurchased ? 'text.disabled' : 'text.primary',
                                  mr: 1,
                                  fontWeight: isMobile ? 'medium' : 'regular',
                                  fontSize: isMobile ? '0.95rem' : 'inherit',
                                  display: 'inline-block',
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word'
                                }}
                              >
                                {product.name}
                              </Typography>
                              <Chip 
                                label={`${product.quantity || 1} ${product.unit || 'db'}`} 
                                size="small" 
                                color={product.isPurchased ? "success" : "primary"}
                                variant={isMobile ? "filled" : "outlined"}
                                sx={{ 
                                  mr: 1, 
                                  height: 24, 
                                  fontSize: '0.75rem',
                                  opacity: product.isPurchased ? 0.7 : 1,
                                  my: 0.5
                                }}
                              />
                              {product.category && !isMobile && (
                                <Chip 
                                  label={product.category.name} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.7rem',
                                    opacity: product.isPurchased ? 0.7 : 1,
                                    maxWidth: '100%',
                                    my: 0.5
                                  }}
                                />
                              )}
                              {product.notes && !isMobile && (
                                <Tooltip title={product.notes}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    ml: 1, 
                                    borderLeft: '1px solid',
                                    borderColor: 'divider',
                                    pl: 1,
                                    my: 0.5
                                  }}>
                                    <CommentIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                                    <Typography 
                                      variant="caption" 
                                      color="text.secondary"
                                      component="span"
                                      sx={{
                                        maxWidth: { xs: '60px', sm: '120px' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: 'inline-block'
                                      }}
                                    >
                                      {product.notes}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box component="div" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              mt: isMobile ? 0.5 : 0,
                              flexWrap: 'wrap' 
                            }}>
                              {isMobile && product.category && (
                                <Chip 
                                  label={product.category.name} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.7rem', 
                                    mr: 1,
                                    opacity: product.isPurchased ? 0.7 : 1,
                                    maxWidth: '100%',
                                    my: 0.5
                                  }}
                                />
                              )}
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                component="span"
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {typeof product.addedBy === 'object' ? product.addedBy.username : product.addedBy || 'Ismeretlen'}
                              </Typography>
                              {isMobile && product.notes && (
                                <Tooltip title={product.notes}>
                                  <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                                    <CommentIcon fontSize="small" sx={{ fontSize: '0.85rem', color: 'text.secondary' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex' }}>
                            <IconButton 
                              edge="end" 
                              onClick={() => toggleProductDetails(product.id)}
                              sx={{ mr: 1 }}
                              size={isMobile ? "small" : "medium"}
                            >
                              {expandedProductId === product.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                            {canEdit && (
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
                                size={isMobile ? "small" : "medium"}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </Fade>
                    <Collapse in={expandedProductId === product.id}>
                      <Box sx={{ 
                        p: { xs: 2, sm: 2 }, 
                        pl: { xs: 3, sm: 9 }, 
                        bgcolor: 'action.hover',
                        borderBottom: index < filteredProducts.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider'
                      }}>
                        {editingProduct && editingProduct.id === product.id ? (
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
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
                            <Grid item xs={6} sm={3}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                label="Egység"
                                value={editingProduct.unit}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  unit: e.target.value
                                })}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
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
                                rows={isMobile ? 3 : 2}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2} sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                              mt: { xs: 1, sm: 0 }
                            }}>
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
                            <Grid item xs={6} sm={4}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  color: 'primary.main',
                                  fontSize: { xs: '0.8rem', sm: 'inherit' }
                                }}
                              >
                                Mennyiség:
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mt: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                p: 1,
                                bgcolor: 'background.paper'
                              }}>
                                <Typography variant="body1" sx={{ 
                                  fontSize: { xs: '1rem', sm: '1.1rem' }, 
                                  fontWeight: '500' 
                                }}>
                                  {product.quantity || 1}
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                                  {product.unit || 'db'}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  color: 'primary.main',
                                  fontSize: { xs: '0.8rem', sm: 'inherit' }
                                }}
                              >
                                Megjegyzések:
                              </Typography>
                              <Paper sx={{ 
                                mt: 1, 
                                p: 1.5, 
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: product.notes ? 'divider' : 'transparent',
                                borderRadius: 1,
                                minHeight: '40px',
                                wordBreak: 'break-word'
                              }}>
                                <Typography component="div" sx={{ fontSize: { xs: '0.85rem', sm: 'inherit' } }}>
                                  {product.notes || 'Nincs megjegyzés'}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid 
                              item 
                              xs={12} 
                              sm={2} 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                                mt: { xs: 1, sm: 0 }
                              }}
                            >
                              {canEdit && (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  onClick={() => handleEditProduct(product)}
                                  startIcon={<EditIcon />}
                                >
                                  Szerkesztés
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                        )}
                      </Box>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: { xs: 4, sm: 6 },
              px: { xs: 2, sm: 0 },
              borderRadius: { xs: 3, sm: 2 },
              border: '1px dashed',
              borderColor: 'divider'
            }}>
              <ShoppingCartIcon sx={{ 
                fontSize: { xs: 36, sm: 48 }, 
                color: 'text.disabled', 
                mb: 2,
                opacity: 0.7
              }} />
              <Typography 
                variant="body1" 
                color="textSecondary"
                sx={{ fontWeight: 'medium' }}
              >
                Adj hozzá termékeket a listához!
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {isMobile ? 
                  'Használd a + gombot termékek hozzáadásához.' : 
                  'Használd a fenti mezőt termékek hozzáadásához.'}
              </Typography>
              
              {isMobile && canEdit && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={toggleAddProductDrawer}
                  sx={{ 
                    mt: 3,
                    borderRadius: 8,
                    boxShadow: 2,
                    px: 3
                  }}
                >
                  Termék hozzáadása
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Container>
      
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
              sx={{ 
                borderRadius: 8,
                width: isMobile ? '45%' : 'auto'
              }}
            >
              Mégsem
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDialogSave}
              disabled={!listTitle.trim()}
              sx={{ 
                borderRadius: 8,
                width: isMobile ? '45%' : 'auto'
              }}
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
              borderRadius: { xs: 4, sm: 2 }
            }
          }}
        />
      </Modal>
      
      {/* Mobile SwipeableDrawer for adding products */}
      {canEdit && isMobile && (
        <>
          <SwipeableDrawer
            anchor="bottom"
            open={addProductDrawerOpen}
            onClose={toggleAddProductDrawer}
            onOpen={toggleAddProductDrawer}
            disableSwipeToOpen={false}
            swipeAreaWidth={56}
            sx={{
              '& .MuiDrawer-paper': {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                maxHeight: '85vh'
              }
            }}
          >
            <Box sx={{ p: 2, pb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  Új termék hozzáadása
                </Typography>
                <IconButton onClick={toggleAddProductDrawer}>
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <Input
                    fullWidth
                    variant="outlined"
                    placeholder="Új termék neve..."
                    value={newProduct}
                    onChange={(e) => {
                      setNewProduct(e.target.value);
                      handleProductSearch(e.target.value);
                    }}
                    sx={{ 
                      '& .MuiInputBase-root': {
                        borderRadius: 8
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
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
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Egység"
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    sx={{ 
                      '& .MuiInputBase-root': {
                        borderRadius: 8
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Megjegyzés"
                    multiline
                    rows={2}
                    value={newProductNotes}
                    onChange={(e) => setNewProductNotes(e.target.value)}
                    sx={{ 
                      '& .MuiInputBase-root': {
                        borderRadius: 8
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={() => {
                      handleAddProduct();
                      setAddProductDrawerOpen(false);
                    }}
                    disabled={!newProduct.trim()}
                    startIcon={<AddIcon />}
                    sx={{ 
                      borderRadius: 8,
                      py: 1.5
                    }}
                  >
                    Termék hozzáadása
                  </Button>
                </Grid>
              </Grid>
              
              {searchResults.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Találatok:
                  </Typography>
                  <Paper elevation={0} variant="outlined" sx={{ 
                    maxHeight: 200, 
                    overflow: 'auto',
                    borderRadius: 2
                  }}>
                    <List dense>
                      {searching ? (
                        <ListItem>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          <ListItemText primary="Keresés folyamatban..." />
                        </ListItem>
                      ) : (
                        searchResults.map(item => (
                          <ListItemButton
                            key={item.id}
                            onClick={() => {
                              setNewProduct(item.name);
                              handleCategorySelect(item.category);
                              setNewProductUnit(item.unit || 'db');
                              setSearchResults([]);
                            }}
                          >
                            <ListItemText 
                              primary={<Typography component="span">{item.name}</Typography>}
                              secondary={`${item.unit || 'db'}`}
                            />
                          </ListItemButton>
                        ))
                      )}
                    </List>
                  </Paper>
                </Box>
              )}
            </Box>
          </SwipeableDrawer>
          
          <Fab
            color="primary"
            aria-label="Termék hozzáadása"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
            onClick={toggleAddProductDrawer}
          >
            <AddIcon />
          </Fab>
        </>
      )}
    </>
  );
};

export default ListEditor;