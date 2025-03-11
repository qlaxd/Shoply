import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Grid2 from '@mui/material/Grid2';

// Importáljuk a közös komponenseket
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import Header from '../../components/layout/Header/Header';

// Importáljuk a feature komponenseket
import ShoppingListCard from '../../components/features/lists/ShoppingListCard';

// Importáljuk a service-eket
import ListService from '../../services/list.service';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        const data = await ListService.getUserLists();
        setLists(data);
        setError(null);
      } catch (err) {
        console.error('Hiba a listák betöltésekor:', err);
        setError('Nem sikerült betölteni a listákat. Kérjük, próbálja újra később!');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      return;
    }

    try {
      const newList = {
        title: newListTitle,
        products: [],
        priority: 3 // Alacsony prioritás az alapértelmezett
      };
      
      await ListService.createList(newList);
      const updatedLists = await ListService.getUserLists();
      setLists(updatedLists);
      setNewListTitle('');
      setNewListDialogOpen(false);
    } catch (err) {
      console.error('Hiba a lista létrehozásakor:', err);
      setError('Nem sikerült létrehozni a listát. Kérjük, próbálja újra később!');
    }
  };

  const handleDeleteList = async (id) => {
    setListToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteList = async () => {
    try {
      await ListService.deleteList(listToDelete);
      // Frissítsük a listákat a törlés után
      const updatedLists = await ListService.getUserLists();
      setLists(updatedLists);
      setDeleteConfirmOpen(false);
      setListToDelete(null);
    } catch (err) {
      console.error('Hiba a lista törlésekor:', err);
      setError('Nem sikerült törölni a listát. Kérjük, próbálja újra később!');
      setDeleteConfirmOpen(false);
    }
  };

  const handleOpenNewListDialog = () => {
    setNewListTitle('');
    setNewListDialogOpen(true);
  };

  const handleCloseNewListDialog = () => {
    setNewListDialogOpen(false);
  };

  const handleEditList = (id) => {
    navigate(`/list/${id}`);
  };

  const handleNewEmptyList = () => {
    navigate('/list/new');
  };

  const filteredLists = lists.filter(list => 
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Bevásárló Listák
      </Typography>
      
      {error && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 xs={12} md={8}>
          <Input
            variant="outlined"
            placeholder="Keresés a listákban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<SearchIcon />}
          />
        </Grid2>
        
        <Grid2 xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            size="medium"
            onClick={handleOpenNewListDialog}
            sx={{ mr: 1 }}
          >
            Új lista
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleNewEmptyList}
          >
            Üres lista
          </Button>
        </Grid2>
      </Grid2>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Loader size={40} />
        </Box>
      ) : filteredLists.length > 0 ? (
        <Grid2 container spacing={3}>
          {filteredLists.map(list => (
            <Grid2 xs={12} sm={6} md={4} lg={3} key={list._id}>
              <ShoppingListCard 
                list={list} 
                onEdit={handleEditList} 
                onDelete={handleDeleteList}
              />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'Nincs találat a keresési feltételeknek megfelelően.' : 'Még nincs egy bevásárlólista sem.'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm ? 'Próbáljon meg egy másik keresési kifejezést.' : 'Hozzon létre egy új listát a "+" gombbal.'}
          </Typography>
        </Box>
      )}

      {/* Új lista létrehozása modális ablak */}
      <Modal
        open={newListDialogOpen}
        onClose={handleCloseNewListDialog}
        title="Új bevásárlólista létrehozása"
        maxWidth="sm"
        actions={
          <>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleCloseNewListDialog}
            >
              Mégse
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCreateList}
              disabled={!newListTitle.trim()}
            >
              Létrehozás
            </Button>
          </>
        }
      >
        <Input
          autoFocus
          fullWidth
          label="Lista neve"
          placeholder="Add meg a lista nevét..."
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          sx={{ mt: 1 }}
        />
      </Modal>

      {/* Lista törlés megerősítő modális ablak */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Lista törlése"
        maxWidth="sm"
        actions={
          <>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Mégse
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={confirmDeleteList}
            >
              Törlés
            </Button>
          </>
        }
      >
        <Typography>Biztosan törölni szeretnéd ezt a listát? Ez a művelet nem visszavonható.</Typography>
      </Modal>
    </Box>
  );
};

export default Home;
