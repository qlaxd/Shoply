import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Avatar,
  Slider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useParams } from 'react-router-dom';
import { blue } from '@mui/material/colors';
import Header from '../../layout/Header/Header';

const ListEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewList = id === 'new';
  
  const [listTitle, setListTitle] = useState('');
  const [priority, setPriority] = useState(3);
  const [newProduct, setNewProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!isNewList);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
  // Simulated user data
  const currentUser = { id: 1, name: 'Felhasználó' };

  useEffect(() => {
    if (!isNewList) {
      // TODO: Replace with API call to fetch list details
      // Placeholder data
      setTimeout(() => {
        setListTitle('Heti bevásárlás');
        setPriority(2);
        setProducts([
          { id: 1, name: 'Tej', addedBy: 'Gábor' },
          { id: 2, name: 'Kenyér', addedBy: 'Anna' },
        ]);
        setLoading(false);
      }, 500);
    }
  }, [id, isNewList, loading, setLoading]);

  const handleAddProduct = () => {
    if (newProduct.trim()) {
      const newProductObj = {
        id: Date.now(), // Temporary ID
        name: newProduct,
        addedBy: currentUser.name
      };
      
      setProducts([...products, newProductObj]);
      setNewProduct('');
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newProduct.trim()) {
      handleAddProduct();
    }
  };

  const handleSave = () => {
    if (products.length === 0) {
      // Show error or prompt
      return;
    }
    
    if (!listTitle.trim()) {
      setSaveDialogOpen(true);
      return;
    }
    
    saveList();
  };

  const saveList = () => {
    // TODO: Implement API call to save the list
    console.log('Saving list:', { 
      id: isNewList ? null : id,
      title: listTitle,
      priority,
      products 
    });
    
    // Navigate back to the dashboard
    navigate('/');
  };

  const handleDialogSave = () => {
    if (listTitle.trim()) {
      setSaveDialogOpen(false);
      saveList();
    }
  };

  const priorityMarks = [
    { value: 1, label: 'Magas' },
    { value: 2, label: 'Közepes' },
    { value: 3, label: 'Alacsony' }
  ];

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

          <Paper sx={{ p: 3, mb: 3 }}>
            <TextField
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

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Termékek
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Új termék hozzáadása..."
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
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
            
            {products.length > 0 ? (
              <List>
                {products.map((product, index) => (
                  <React.Fragment key={product.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem 
                      secondaryAction={
                        <IconButton edge="end" onClick={() => handleDeleteProduct(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: blue[500], 
                          width: 32, 
                          height: 32, 
                          mr: 2,
                          fontSize: '0.9rem'
                        }}
                      >
                        {product.addedBy.charAt(0)}
                      </Avatar>
                      <ListItemText 
                        primary={product.name} 
                        secondary={`Hozzáadta: ${product.addedBy}`} 
                      />
                    </ListItem>
                  </React.Fragment>
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
        
        {/* Dialog for entering list title if missing */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Add címet a listának</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Lista címe"
              fullWidth
              variant="outlined"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="Pl. Hétvégi grillparti"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Mégse</Button>
            <Button 
              onClick={handleDialogSave}
              disabled={!listTitle.trim()}
              variant="contained"
            >
              Mentés
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ListEditor; 