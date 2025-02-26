import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button, TextField, InputAdornment, Grid, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import ShoppingListCard from '../../components/features/lists/ShoppingListCard';
import Header from '../../components/layout/Header/Header';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    // TODO: Implement API call to fetch shopping lists
    // Placeholder data for now
    const dummyLists = [
      { 
        id: 1, 
        title: 'Hétvégi grillparti', 
        priority: 1, 
        products: [
          { id: 1, name: 'Csirkemell', addedBy: 'Gábor' },
          { id: 2, name: 'Sör', addedBy: 'Péter' },
          { id: 3, name: 'Faszén', addedBy: 'Anna' },
        ] 
      },
      { 
        id: 2, 
        title: 'Heti bevásárlás', 
        priority: 2, 
        products: [
          { id: 4, name: 'Tej', addedBy: 'Éva' },
          { id: 5, name: 'Kenyér', addedBy: 'Gábor' },
          { id: 6, name: 'Sajt', addedBy: 'Anna' },
        ] 
      },
    ];
    
    setLists(dummyLists);
    setLoading(false);
  }, []);

  const handleCreateList = () => {
    if (newListTitle.trim()) {
      // TODO: Implement API call to create new list
      // For now, just add to local state
      const newList = {
        id: lists.length + 1,
        title: newListTitle,
        priority: lists.length + 1,
        products: []
      };
      
      setLists([...lists, newList]);
      setNewListTitle('');
    } else {
      // Open list editor without a title
      navigate('/list/new');
    }
  };

  const handleEditList = (id) => {
    navigate(`/list/${id}`);
  };

  const filteredLists = lists.filter(list => 
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <Container maxWidth="md" className="dashboard-container">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Bevásárló Listák
          </Typography>
          
          <Box sx={{ display: 'flex', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Keresés a listákban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2 }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                placeholder="Új lista neve..."
                variant="outlined"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                sx={{ mr: 1 }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleCreateList}
              >
                Új lista
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredLists.length > 0 ? (
            <Grid container spacing={3}>
              {filteredLists.map((list) => (
                <Grid item xs={12} sm={6} md={4} key={list.id}>
                  <ShoppingListCard 
                    list={list} 
                    onEdit={() => handleEditList(list.id)} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                Nincsenek bevásárló listák. Hozz létre egyet az "Új lista" gombbal!
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
