import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { useNavigate } from 'react-router-dom';
import { extendTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
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

// Navigációs konfiguráció
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Főmenü',
  },
  {
    segment: 'dashboard',
    title: 'Áttekintés',
    icon: <DashboardIcon />,
  },
  {
    segment: 'shopping-lists',
    title: 'Bevásárló Listák',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analitika',
  },
  {
    segment: 'reports',
    title: 'Jelentések',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'statistics',
        title: 'Statisztikák',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'history',
        title: 'Előzmények',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'settings',
    title: 'Beállítások',
    icon: <LayersIcon />,
  },
];

// Egyedi téma létrehozása
const customTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Router mock az AppProvider-hez
function useCustomRouter(initialPath) {
  const navigate = useNavigate();
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path));
        navigate(path);
      },
    };
  }, [pathname, navigate]);

  return router;
}

const Home = () => {
  const navigate = useNavigate();
  const router = useCustomRouter('/shopping-lists');
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
        setError('Nem sikerült betölteni a listákat');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleCreateList = async () => {
    if (newListTitle.trim()) {
      try {
        setLoading(true);
        
        // Ellenőrizzük, hogy van-e bejelentkezett felhasználó
        if (!userId) {
          setError('Listát csak bejelentkezett felhasználó hozhat létre.');
          setLoading(false);
          return;
        }
        
        const newList = {
          title: newListTitle,
          priority: 3,
          products: [],
          owner: userId // Pontos ObjectId a MongoDB számára
        };
        
        const createdList = await ListService.createList(newList);
        setLists(prevLists => [...prevLists, createdList]);
        setNewListTitle('');
        setNewListDialogOpen(false);
        setError(null); // Sikeres létrehozás esetén töröljük a hibát
      } catch (err) {
        console.error('Hiba a lista létrehozásakor:', err);
        // Részletesebb hibaüzenet megjelenítése
        if (err.response?.data?.error?.message) {
          setError(`Nem sikerült létrehozni a listát: ${err.response.data.error.message}`);
        } else {
          setError('Nem sikerült létrehozni a listát. Ellenőrizd, hogy be vagy-e jelentkezve.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteList = async (id) => {
    setListToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteList = async () => {
    if (listToDelete) {
      try {
        setLoading(true);
        await ListService.deleteList(listToDelete);
        setLists(prevLists => prevLists.filter(list => list._id !== listToDelete));
      } catch (err) {
        console.error('Hiba a lista törlésekor:', err);
        setError('Nem sikerült törölni a listát');
      } finally {
        setLoading(false);
        setDeleteConfirmOpen(false);
        setListToDelete(null);
      }
    }
  };

  const handleOpenNewListDialog = () => {
    setNewListDialogOpen(true);
  };

  const handleCloseNewListDialog = () => {
    setNewListDialogOpen(false);
    setNewListTitle('');
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
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={customTheme}
    >
      <DashboardLayout>
        <Header />
        <PageContainer>
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
                  fullWidth
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
              <Loader text="Listák betöltése..." fullPage={false} />
            ) : filteredLists.length > 0 ? (
              <Grid2 container spacing={3}>
                {filteredLists.map((list) => (
                  <Grid2 xs={12} sm={6} md={4} key={list._id}>
                    <ShoppingListCard
                      list={list}
                      onEdit={handleEditList}
                      onDelete={handleDeleteList}
                    />
                  </Grid2>
                ))}
              </Grid2>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 6, mb: 6 }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Nincsenek bevásárló listák.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenNewListDialog}
                  sx={{ mt: 2 }}
                >
                  Új lista létrehozása
                </Button>
              </Box>
            )}
          </Box>
        </PageContainer>
      </DashboardLayout>
      
      {/* Új lista létrehozása modális ablak */}
      <Modal
        open={newListDialogOpen}
        onClose={handleCloseNewListDialog}
        title="Új bevásárló lista létrehozása"
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
        <Typography>
          Biztosan törölni szeretnéd ezt a listát? Ez a művelet nem vonható vissza.
        </Typography>
      </Modal>
    </AppProvider>
  );
};

export default Home;
