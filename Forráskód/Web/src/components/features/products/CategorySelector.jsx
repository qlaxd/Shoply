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
  Grid
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import ProductCatalogService from '../../../services/productCatalog.service';

// Előre definiált kategóriák (később dinamikusan betölthetők az API-ból)
const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'Összes termék', count: 0 },
  { id: 'groceries', name: 'Élelmiszerek', count: 0 },
  { id: 'dairy', name: 'Tejtermékek', count: 0 },
  { id: 'meat', name: 'Húsáruk', count: 0 },
  { id: 'fruits', name: 'Gyümölcsök', count: 0 },
  { id: 'vegetables', name: 'Zöldségek', count: 0 },
  { id: 'bakery', name: 'Pékáruk', count: 0 },
  { id: 'drinks', name: 'Italok', count: 0 },
  { id: 'cleaning', name: 'Tisztítószerek', count: 0 },
  { id: 'household', name: 'Háztartási cikkek', count: 0 },
  { id: 'other', name: 'Egyéb', count: 0 }
];

const CategorySelector = ({ onCategorySelect, selectedCategory = 'all' }) => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Kategóriák betöltése
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
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
        
        // Frissített kategóriák beállítása
        const updatedCategories = categories.map(category => ({
          ...category,
          count: categoryCounts[category.id] || 0
        }));
        
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Hiba a kategóriák betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleCategorySelect = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        mb: { xs: 2, md: 3 }
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
        <ListItemButton onClick={handleClick}>
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
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        
        <Divider />
        
        <Collapse in={open} timeout="auto" unmountOnExit>
          {loading ? (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            isMobile ? (
              <Box sx={{ p: 2 }}>
                <Grid container spacing={1}>
                  {categories.map((category) => (
                    <Grid item xs={6} sm={4} key={category.id}>
                      <Chip
                        label={`${category.name} (${category.count})`}
                        onClick={() => handleCategorySelect(category.id)}
                        color={selectedCategory === category.id ? "primary" : "default"}
                        variant={selectedCategory === category.id ? "filled" : "outlined"}
                        sx={{ 
                          width: '100%', 
                          justifyContent: 'flex-start',
                          height: 'auto',
                          py: 0.5
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <List component="div" disablePadding>
                {categories.map((category) => (
                  <ListItemButton 
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    sx={{ 
                      pl: 4,
                      '&.Mui-selected': {
                        bgcolor: theme.palette.primary.light + '20',
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                      },
                      '&.Mui-selected:hover': {
                        bgcolor: theme.palette.primary.light + '30',
                      }
                    }}
                  >
                    <ListItemText 
                      primary={category.name} 
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        color: selectedCategory === category.id ? 'primary' : 'inherit'
                      }}
                    />
                    <Chip 
                      label={category.count} 
                      size="small"
                      color={selectedCategory === category.id ? "primary" : "default"}
                      variant={selectedCategory === category.id ? "filled" : "outlined"}
                    />
                  </ListItemButton>
                ))}
              </List>
            )
          )}
        </Collapse>
      </List>
    </Paper>
  );
};

export default CategorySelector; 