import React, { useState, useEffect } from 'react';
import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
  Badge,
  Zoom,
  Fade,
  Avatar,
  Skeleton
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RefreshIcon from '@mui/icons-material/Refresh';

import ProductCatalogService from '../../../services/productCatalog.service';
import CategoryService from '../../../services/category.service';

// Kategóriákhoz színek
const CATEGORY_COLORS = {
  'all': '#3f51b5',
  'groceries': '#4caf50',
  'dairy': '#03a9f4',
  'meat': '#f44336',
  'fruits': '#ff9800',
  'vegetables': '#8bc34a',
  'bakery': '#795548',
  'drinks': '#2196f3',
  'cleaning': '#9c27b0',
  'household': '#607d8b',
  'other': '#9e9e9e'
};

const CategorySelector = ({ onCategorySelect, selectedCategory = 'all' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Kategóriák betöltése
  const loadCategories = async () => {
    setLoading(true);
    try {
      // Először betöltjük a kategóriákat a kategória szolgáltatásból
      const categoryData = await CategoryService.getAllCategories();
      
      // Az összes termék lekérése
      const allProducts = await ProductCatalogService.getAllCatalogItems();
      
      // Kategóriák és termékszámok számolása
      const categoryCounts = { all: allProducts.length };
      
      allProducts.forEach(product => {
        if (product.category) {
          categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        } else {
          categoryCounts['other'] = (categoryCounts['other'] || 0) + 1;
        }
      });
      
      // Kategória lista összeállítása
      const formattedCategories = [
        { id: 'all', name: 'Összes termék', count: allProducts.length }
      ];
      
      // Ha van kategória adat API-ból, azt használjuk
      if (categoryData && categoryData.length > 0) {
        categoryData.forEach(category => {
          formattedCategories.push({
            id: category.id || category._id,
            name: category.name,
            count: categoryCounts[category.id || category._id] || 0,
            icon: category.icon,
            color: category.color || CATEGORY_COLORS[category.id] || theme.palette.primary.main
          });
        });
      } else {
        // Ha nincs API adat, akkor az alapértelmezett kategóriákat használjuk
        Object.entries(CATEGORY_COLORS).forEach(([id, color]) => {
          if (id !== 'all') {
            let categoryName = id.charAt(0).toUpperCase() + id.slice(1);
            // Magyar nevek hozzárendelése
            if (id === 'groceries') categoryName = 'Élelmiszerek';
            if (id === 'dairy') categoryName = 'Tejtermékek';
            if (id === 'meat') categoryName = 'Húsáruk';
            if (id === 'fruits') categoryName = 'Gyümölcsök';
            if (id === 'vegetables') categoryName = 'Zöldségek';
            if (id === 'bakery') categoryName = 'Pékáruk';
            if (id === 'drinks') categoryName = 'Italok';
            if (id === 'cleaning') categoryName = 'Tisztítószerek';
            if (id === 'household') categoryName = 'Háztartási cikkek';
            if (id === 'other') categoryName = 'Egyéb';
            
            formattedCategories.push({
              id,
              name: categoryName,
              count: categoryCounts[id] || 0,
              color
            });
          }
        });
      }
      
      setCategories(formattedCategories);
      setError(null);
    } catch (error) {
      console.error('Hiba a kategóriák betöltésekor:', error);
      setError('Nem sikerült betölteni a kategóriákat.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Első betöltés
  useEffect(() => {
    loadCategories();
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleCategorySelect = (categoryId) => {
    onCategorySelect(categoryId);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  // Betöltés közben megjelenítendő komponens
  const renderLoadingSkeleton = () => (
    <Box sx={{ p: 2 }}>
      {isMobile ? (
        <Grid container spacing={1}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Skeleton 
                variant="rectangular" 
                height={40} 
                width="100%" 
                sx={{ borderRadius: 4 }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {Array.from(new Array(6)).map((_, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Skeleton 
                variant="rectangular" 
                height={48} 
                width="100%" 
                sx={{ borderRadius: 1 }}
              />
            </Box>
          ))}
        </>
      )}
    </Box>
  );

  // Kategória lista renderelése
  const renderCategoryList = () => {
    if (error) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    if (isMobile) {
      return (
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            {categories.map((category, index) => (
              <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }} key={category.id}>
                <Grid item xs={6} sm={4}>
                  <Chip
                    avatar={
                      <Avatar 
                        sx={{ 
                          bgcolor: category.color || theme.palette.primary.main,
                          color: '#fff'
                        }}
                      >
                        {category.icon || category.name.charAt(0)}
                      </Avatar>
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                          {category.name}
                        </Typography>
                        <Chip 
                          label={category.count} 
                          size="small"
                          variant="outlined"
                          sx={{ ml: 0.5, minWidth: 32 }}
                        />
                      </Box>
                    }
                    onClick={() => handleCategorySelect(category.id)}
                    color={selectedCategory === category.id ? "primary" : "default"}
                    variant={selectedCategory === category.id ? "filled" : "outlined"}
                    sx={{ 
                      width: '100%', 
                      justifyContent: 'flex-start',
                      height: 'auto',
                      py: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }
                    }}
                  />
                </Grid>
              </Zoom>
            ))}
          </Grid>
        </Box>
      );
    }

    return (
      <List component="div" disablePadding>
        {categories.map((category, index) => (
          <Fade in={true} style={{ transitionDelay: `${index * 30}ms` }} key={category.id}>
            <ListItemButton 
              selected={selectedCategory === category.id}
              onClick={() => handleCategorySelect(category.id)}
              sx={{ 
                pl: 4,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: theme.palette.primary.light + '20',
                  borderLeft: `4px solid ${category.color || theme.palette.primary.main}`,
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold'
                  }
                },
                '&.Mui-selected:hover': {
                  bgcolor: theme.palette.primary.light + '30',
                },
                '&:hover': {
                  transform: 'translateX(4px)'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {category.id === 'all' ? (
                  <ShoppingBasketIcon 
                    fontSize="small" 
                    sx={{ color: category.color || theme.palette.primary.main }}
                  />
                ) : (
                  <LocalOfferIcon 
                    fontSize="small" 
                    sx={{ color: category.color || theme.palette.primary.main }}
                  />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={category.name} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  color: selectedCategory === category.id ? 'primary' : 'inherit'
                }}
              />
              <Badge 
                badgeContent={category.count} 
                color={selectedCategory === category.id ? "primary" : "default"}
                sx={{ mr: 1 }}
              />
            </ListItemButton>
          </Fade>
        ))}
      </List>
    );
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        mb: { xs: 2, md: 3 },
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }
      }}
    >
      <List 
        component="nav"
        sx={{ 
          width: '100%', 
          bgcolor: 'background.paper',
          p: 0
        }}
        disablePadding
      >
        <ListItemButton 
          onClick={handleClick}
          sx={{ 
            bgcolor: theme.palette.primary.light + '10',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: theme.palette.primary.light + '20',
            }
          }}
        >
          <ListItemIcon>
            <CategoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography variant="subtitle1" fontWeight="medium">
                Kategóriák
              </Typography>
            } 
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {refreshing ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : (
              <RefreshIcon 
                fontSize="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                sx={{ 
                  mr: 1, 
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'rotate(180deg)' }
                }}
              />
            )}
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </ListItemButton>
        
        <Divider />
        
        <Collapse in={open} timeout="auto" unmountOnExit>
          {loading ? renderLoadingSkeleton() : renderCategoryList()}
        </Collapse>
      </List>
    </Paper>
  );
};

export default CategorySelector; 