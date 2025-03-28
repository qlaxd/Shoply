import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Fade, 
  Alert, 
  AlertTitle, 
  useMediaQuery, 
  useTheme, 
  Divider,
  Tabs,
  Tab,
  Chip,
  Paper,
  Tooltip,
  IconButton,
  Zoom,
  Fab,
  Collapse,
  Skeleton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from 'react-router-dom';
import Grid2 from '@mui/material/Grid2';

// Importáljuk a közös komponenseket
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

// Importáljuk a feature komponenseket
import ShoppingListCard from '../../components/features/lists/ShoppingListCard';

// Importáljuk a service-eket
import ListService from '../../services/list.service';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Állapotok
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [newListPriority, setNewListPriority] = useState(3);
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState('priority'); // 'priority', 'name', 'date'
  const [filterTab, setFilterTab] = useState(0); // 0: All, 1: High, 2: Medium, 3: Low
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const userId = localStorage.getItem('userId');

  // Listák betöltése
  const fetchLists = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await ListService.getUserLists();
      setLists(data);
      setError(null);
    } catch (err) {
      console.error('Hiba a listák betöltésekor:', err);
      setError('Nem sikerült betölteni a listákat. Kérjük, próbálja újra később!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Lista létrehozása
  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      return;
    }

    try {
      const newList = {
        title: newListTitle,
        products: [],
        priority: newListPriority
      };
      
      await ListService.createList(newList);
      await fetchLists();
      setNewListTitle('');
      setNewListPriority(3);
      setNewListDialogOpen(false);
    } catch (err) {
      console.error('Hiba a lista létrehozásakor:', err);
      setError('Nem sikerült létrehozni a listát. Kérjük, próbálja újra később!');
    }
  };

  // Lista törlése
  const handleDeleteList = async (id) => {
    setListToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteList = async () => {
    try {
      await ListService.deleteList(listToDelete);
      await fetchLists();
      setDeleteConfirmOpen(false);
      setListToDelete(null);
    } catch (err) {
      console.error('Hiba a lista törlésekor:', err);
      setError('Nem sikerült törölni a listát. Kérjük, próbálja újra később!');
      setDeleteConfirmOpen(false);
    }
  };

  // Új lista dialógus kezelése
  const handleOpenNewListDialog = () => {
    setNewListTitle('');
    setNewListPriority(3);
    setNewListDialogOpen(true);
  };

  const handleCloseNewListDialog = () => {
    setNewListDialogOpen(false);
  };

  // Lista szerkesztése
  const handleEditList = (id) => {
    navigate(`/list/${id}`);
  };

  // Üres lista létrehozása
  const handleNewEmptyList = () => {
    navigate('/list/new');
  };

  // Listák frissítése
  const handleRefreshLists = () => {
    fetchLists(true);
  };

  // Szűrés és rendezés
  const handleSortChange = () => {
    // Körkörösen váltunk a rendezési módok között
    if (sortOrder === 'priority') {
      setSortOrder('name');
    } else if (sortOrder === 'name') {
      setSortOrder('date');
    } else {
      setSortOrder('priority');
    }
  };

  const handleFilterChange = (event, newValue) => {
    setFilterTab(newValue);
  };

  // Szűrési opciók megjelenítése/elrejtése
  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  // Szűrt és rendezett listák
  const filteredAndSortedLists = useMemo(() => {
    // Először szűrjük a listákat a keresési kifejezés alapján
    let result = lists.filter(list => 
      list.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Szűrés prioritás szerint
    if (filterTab === 1) {
      result = result.filter(list => list.priority === 1); // Magas
    } else if (filterTab === 2) {
      result = result.filter(list => list.priority === 2); // Közepes
    } else if (filterTab === 3) {
      result = result.filter(list => list.priority === 3); // Alacsony
    }
    
    // Rendezés
    return result.sort((a, b) => {
      if (sortOrder === 'priority') {
        return a.priority - b.priority;
      } else if (sortOrder === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === 'date') {
        // Feltételezzük, hogy van createdAt mező, ha nincs, akkor az _id-t használjuk
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a._id.substring(0, 8));
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b._id.substring(0, 8));
        return dateB - dateA; // Legújabb elöl
      }
      return 0;
    });
  }, [lists, searchTerm, sortOrder, filterTab]);

  // Rendezési mód szövege
  const getSortOrderText = () => {
    switch (sortOrder) {
      case 'priority': return 'Prioritás szerint';
      case 'name': return 'Név szerint';
      case 'date': return 'Dátum szerint';
      default: return '';
    }
  };

  // Lebegő gomb animáció
  const renderFloatingActionButton = () => (
    <Zoom in={!loading} timeout={300}>
      <Fab
        color="primary"
        aria-label="add list"
        onClick={handleOpenNewListDialog}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' },
          boxShadow: theme.shadows[8],
        }}
      >
        <AddIcon />
      </Fab>
    </Zoom>
  );

  // Skeleton loader komponensek
  const renderSkeletonLoaders = () => (
    <Grid2 container spacing={3}>
      {[...Array(6)].map((_, index) => (
        <Grid2 xs={12} sm={6} md={4} lg={3} key={index}>
          <Paper
            sx={{
              p: 2,
              height: 240,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Skeleton variant="text" width="70%" height={32} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Skeleton variant="rectangular" width="45%" height={36} />
              <Skeleton variant="rectangular" width="45%" height={36} />
            </Box>
          </Paper>
        </Grid2>
      ))}
    </Grid2>
  );

  return (
    <Box sx={{ my: 4, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 2, sm: 0 },
              fontSize: { xs: '1.8rem', sm: '2.125rem' },
              color: 'white',
              textShadow: `1px 1px 3px rgba(0, 0, 0, 0.3)`,
              letterSpacing: '0.5px',
              paddingY: 1,
              paddingX: 2,
              borderRadius: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              boxShadow: theme.shadows[4],
              textAlign: 'center',
            }}
          >
            Bevásárló Listák
          </Typography>
        </Box>
      </Box>
      
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              boxShadow: 2,
              borderRadius: 2
            }}
            onClose={() => setError(null)}
          >
            <AlertTitle>Hiba</AlertTitle>
            {error}
          </Alert>
        </Fade>
      )}
      
      <Paper 
        sx={{ 
          mb: 4, 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 3,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 5
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 xs={12} md={8}>
              <Input
                variant="outlined"
                placeholder="Keresés a listákban..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startIcon={<SearchIcon />}
                fullWidth
                sx={{ 
                  '& .MuiInputBase-root': {
                    borderRadius: 8
                  }
                }}
              />
            </Grid2>
            
            <Grid2 xs={12} md={4} sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                size={isMobile ? "small" : "medium"}
                onClick={handleOpenNewListDialog}
                sx={{ 
                  flexGrow: { xs: 1, sm: 0 },
                  display: { xs: 'none', md: 'flex' },
                  borderRadius: 8
                }}
              >
                Új lista
              </Button>
              
              {!isMobile && (
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={handleNewEmptyList}
                  sx={{ 
                    borderRadius: 8,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  Üres lista
                </Button>
              )}
            </Grid2>
          </Grid2>
        </Box>
        <Collapse in={showFilterOptions || !isMobile}>
          <Divider />
          
          <Tabs 
            value={filterTab} 
            onChange={handleFilterChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ 
              bgcolor: 'background.paper',
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterListIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <span>Összes</span>
                </Box>
              } 
              sx={{ transition: 'all 0.2s ease' }}
            />
            <Tab 
              label={
                <Chip 
                  label="Magas" 
                  size="small" 
                  color="error" 
                  sx={{ 
                    minWidth: '80px',
                    fontWeight: filterTab === 1 ? 'bold' : 'normal',
                    transform: filterTab === 1 ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              } 
            />
            <Tab 
              label={
                <Chip 
                  label="Közepes" 
                  size="small" 
                  color="warning" 
                  sx={{ 
                    minWidth: '80px',
                    fontWeight: filterTab === 2 ? 'bold' : 'normal',
                    transform: filterTab === 2 ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              } 
            />
            <Tab 
              label={
                <Chip 
                  label="Alacsony" 
                  size="small" 
                  color="info" 
                  sx={{ 
                    minWidth: '80px',
                    fontWeight: filterTab === 3 ? 'bold' : 'normal',
                    transform: filterTab === 3 ? 'scale(1.05)' : 'scale(1)'
                  }}
                />
              } 
            />
          </Tabs>
        </Collapse>
      </Paper>

      {/* Filter and Sort Controls - Enhanced Responsive Layout */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 3,
          p: 1.5,
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: 'transparent'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Tooltip title="Szűrési opciók">
              <Button 
                variant="outlined"
                size="small"
                startIcon={<TuneIcon />}
                onClick={toggleFilterOptions}
                sx={{ 
                  borderRadius: 8,
                  minWidth: { xs: '100px', sm: 'auto' },
                  px: { xs: 2, sm: 2 },
                  display: { xs: 'flex', sm: 'none' }, // Only visible on mobile
                  '& .MuiButton-startIcon': {
                    margin: { xs: '0 8px 0 0', sm: '0 8px 0 0' }
                  }
                }}
              >
                <Box sx={{ display: 'block' }}>Szűrés</Box>
              </Button>
            </Tooltip>
            
            <Tooltip title={`Rendezés: ${getSortOrderText()}`}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SortIcon />}
                onClick={handleSortChange}
                sx={{ 
                  borderRadius: 8,
                  minWidth: { xs: '100px', sm: 'auto' },
                  px: { xs: 2, sm: 2 },
                  '& .MuiButton-startIcon': {
                    margin: { xs: '0 8px 0 0', sm: '0 8px 0 0' }
                  }
                }}
              >
                <Box sx={{ display: 'block' }}>
                  {getSortOrderText()}
                </Box>
              </Button>
            </Tooltip>
            
            <Tooltip title="Frissítés">
              <span>
                <IconButton 
                  color="primary" 
                  onClick={handleRefreshLists}
                  disabled={refreshing || loading}
                  size="small"
                  sx={{
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    },
                    border: `1px solid ${theme.palette.primary.light}`,
                    borderRadius: 8,
                    p: 1
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {loading ? (
        renderSkeletonLoaders()
      ) : filteredAndSortedLists.length > 0 ? (
        <Fade in={!loading} timeout={500}>
          <Grid2 container spacing={3} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            {filteredAndSortedLists.map((list, index) => (
              <Grid2 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                key={list._id}
                sx={{ 
                  width: { xs: '100%' },
                  maxWidth: { xs: '360px', sm: 'none' }
                }}
              >
                <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Box sx={{ 
                    height: '100%',
                    width: '100%'
                  }}>
                    <ShoppingListCard 
                      list={list} 
                      onEdit={handleEditList} 
                      onDelete={handleDeleteList}
                    />
                  </Box>
                </Zoom>
              </Grid2>
            ))}
          </Grid2>
        </Fade>
      ) : (
        <Fade in={!loading} timeout={500}>
          <Paper 
            sx={{ 
              textAlign: 'center', 
              py: 6, 
              px: 3, 
              mt: 4,
              borderRadius: 2,
              boxShadow: 4,
              background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {searchTerm ? 'Nincs találat a keresési feltételeknek megfelelően.' : 'Még nincs egy bevásárlólista sem.'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              {searchTerm ? 'Próbáljon meg egy másik keresési kifejezést.' : 'Hozzon létre egy új listát a "+" gombbal.'}
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleOpenNewListDialog}
              sx={{ 
                borderRadius: 8,
                px: 3,
                py: 1,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              Új lista létrehozása
            </Button>
          </Paper>
        </Fade>
      )}

      {/* Lebegő gomb mobil nézetben */}
      {renderFloatingActionButton()}

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
              sx={{ borderRadius: 8 }}
            >
              Mégse
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCreateList}
              disabled={!newListTitle.trim()}
              sx={{ borderRadius: 8 }}
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
          sx={{ 
            mt: 1, 
            mb: 3,
            '& .MuiInputBase-root': {
              borderRadius: 2
            }
          }}
        />
        
        <Typography variant="subtitle2" gutterBottom>
          Prioritás
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            variant={newListPriority === 1 ? "contained" : "outlined"}
            color="error"
            onClick={() => setNewListPriority(1)}
            fullWidth
            sx={{ 
              borderRadius: 8,
              py: 1.5,
              transition: 'all 0.2s ease',
              transform: newListPriority === 1 ? 'translateY(-2px)' : 'none',
              boxShadow: newListPriority === 1 ? 3 : 0
            }}
          >
            Magas
          </Button>
          <Button
            variant={newListPriority === 2 ? "contained" : "outlined"}
            color="warning"
            onClick={() => setNewListPriority(2)}
            fullWidth
            sx={{ 
              borderRadius: 8,
              py: 1.5,
              transition: 'all 0.2s ease',
              transform: newListPriority === 2 ? 'translateY(-2px)' : 'none',
              boxShadow: newListPriority === 2 ? 3 : 0
            }}
          >
            Közepes
          </Button>
          <Button
            variant={newListPriority === 3 ? "contained" : "outlined"}
            color="info"
            onClick={() => setNewListPriority(3)}
            fullWidth
            sx={{ 
              borderRadius: 8,
              py: 1.5,
              transition: 'all 0.2s ease',
              transform: newListPriority === 3 ? 'translateY(-2px)' : 'none',
              boxShadow: newListPriority === 3 ? 3 : 0
            }}
          >
            Alacsony
          </Button>
        </Box>
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
              sx={{ borderRadius: 8 }}
            >
              Mégse
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={confirmDeleteList}
              sx={{ borderRadius: 8 }}
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
