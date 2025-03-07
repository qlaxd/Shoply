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
  ListItemSecondaryAction
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../layout/Header/Header';

// Common komponensek importálása
import Button from '../../common/Button';
import Input from '../../common/Input';
import Modal from '../../common/Modal';
import Loader from '../../common/Loader';

// Services importálása
import ListService from '../../../services/list.service';
import ProductCatalogService from '../../../services/productCatalog.service';

const ListEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewList = id === 'new';
  
  // Állapotok
  const [listTitle, setListTitle] = useState('');
  const [priority, setPriority] = useState(3);
  const [newProduct, setNewProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!isNewList);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  
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
                addedBy: product.addedBy || 'Ismeretlen'
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

    fetchListData();
  }, [id, isNewList]);

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
            name: item.name
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
          addedBy: username || 'Felhasználó'
        };
        
        if (!isNewList) {
          // Létező listához adjuk a terméket
          const addedProductResponse = await ListService.addProductToList(id, newProductObj);
          
          if (addedProductResponse && (addedProductResponse._id || addedProductResponse.id)) {
            // Ha a backend visszaadta a teljes terméket
            const addedProduct = {
              id: addedProductResponse._id || addedProductResponse.id,
              name: addedProductResponse.name || newProduct,
              addedBy: addedProductResponse.addedBy || username || 'Felhasználó'
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
        
        // Termék hozzáadása után töröljük a beviteli mezőt és keresési eredményeket
        setNewProduct('');
        setSearchResults([]);
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

  // Enter billentyű kezelése az új termék hozzáadásánál
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newProduct.trim()) {
      e.preventDefault();
      handleAddProduct();
    }
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
      setLoading(true);
      setError(null);
      
      // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
      if (!userId) {
        setError('Listát csak bejelentkezett felhasználó hozhat létre vagy módosíthat.');
        setLoading(false);
        return;
      }
      
      const listData = {
        title: listTitle.trim(),
        priority: priority,
        products: products.map(p => ({ 
          name: p.name, 
          addedBy: p.addedBy || username || 'Felhasználó' 
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
      setLoading(false);
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

  // Betöltési állapot megjelenítése
  if (loading) {
    return <Loader text="Lista betöltése..." fullPage={true} />;
  }

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              {isNewList ? 'Új Bevásárló Lista' : 'Lista Szerkesztése'}
            </Typography>
          </Box>

          {/* Hibaüzenet megjelenítése */}
          {error && (
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          {/* Lista adatok szerkesztése */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Input
              fullWidth
              label="Lista Címe"
              variant="outlined"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="Adj címet a listának (pl. Hétvégi grillparti)"
              sx={{ mb: 3 }}
            />
            
            <Typography gutterBottom>Prioritás</Typography>
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
                  }
                }}
              />
            </Box>
          </Paper>

          {/* Termékek kezelése */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Termékek
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Input
                fullWidth
                variant="outlined"
                placeholder="Új termék hozzáadása..."
                value={newProduct}
                onChange={(e) => {
                  setNewProduct(e.target.value);
                  handleProductSearch(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAddProduct}
                        disabled={!newProduct.trim()}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            {/* Keresési találatok megjelenítése */}
            {searchResults.length > 0 && (
              <Paper elevation={3} sx={{ mb: 3, maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                  {searching ? (
                    <ListItem>
                      <ListItemText primary="Keresés folyamatban..." />
                    </ListItem>
                  ) : (
                    searchResults.map(item => (
                      <ListItem
                        key={item.id}
                        button
                        onClick={() => {
                          setNewProduct(item.name);
                          setSearchResults([]);
                        }}
                      >
                        <ListItemText primary={item.name} />
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            )}
            
            {/* Termékek listája */}
            {products.length > 0 ? (
              <List>
                {products.map((product, index) => (
                  <ListItem key={product.id || index} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={product.isPurchased || false}
                        onChange={() => handleToggleProduct(product.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={product.name}
                      secondary={`Hozzáadta: ${typeof product.addedBy === 'object' ? product.addedBy.username : product.addedBy || 'Ismeretlen'}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteProduct(product.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  Adj hozzá termékeket a listához!
                </Typography>
              </Box>
            )}
          </Paper>
          
          {/* Mentés gomb */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={products.length === 0}
            >
              Mentés
            </Button>
          </Box>
        </Box>
        
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
              >
                Mégsem
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogSave}
                disabled={!listTitle.trim()}
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
            sx={{ mt: 2 }}
          />
        </Modal>
      </Container>
    </>
  );
};

export default ListEditor; 