import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  useTheme
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Common komponensek importálása
import Card from '../../common/Card';
import Button from '../../common/Button';

// Színek meghatározása a prioritás számára és az avatárokhoz
const getAvatarColor = (name) => {
  const colors = [
    '#2196f3', // blue
    '#ff9800', // orange
    '#4caf50', // green
    '#9c27b0', // purple
    '#f44336'  // red
  ];
  
  // Egyszerűen visszaadjuk az első színt, vagy választunk egy másikat ha kell
  return colors[0]; 
};

const ShoppingListCard = ({ list, onEdit, onDelete }) => {
  const theme = useTheme();
  const { _id, title, products = [], priority } = list;
  
  // Csak az első 3 terméket jelenítjük meg a kártyán
  const displayProducts = products.slice(0, 3);
  const remainingCount = products.length - displayProducts.length;

  // Prioritás szöveg és szín meghatározása
  const getPriorityText = (priority) => {
    switch(priority) {
      case 1: return 'Magas';
      case 2: return 'Közepes';
      case 3: 
      default: return 'Alacsony';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 1: return 'error';
      case 2: return 'warning';
      case 3: 
      default: return 'info';
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(_id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(_id);
    }
  };

  const productsList = (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ShoppingBasketIcon 
          color="primary" 
          sx={{ mr: 1, fontSize: '1.2rem' }} 
        />
        <Typography variant="body2" color="text.secondary">
          {products.length} termék
        </Typography>
      </Box>
      
      <List dense sx={{ pt: 0 }}>
        {displayProducts.map((product) => (
          <ListItem key={product._id || product.id} disableGutters sx={{ px: 0 }}>
            <Avatar 
              sx={{ 
                width: 24, 
                height: 24, 
                mr: 1, 
                fontSize: '0.8rem',
                bgcolor: getAvatarColor(product.addedBy)
              }}
            >{''}</Avatar>
            <ListItemText 
              primary={product.name} 
              secondary={`Hozzáadta: ${typeof product.addedBy === 'object' ? product.addedBy.username : product.addedBy || 'Ismeretlen'}`}
              primaryTypographyProps={{ variant: 'body2' }}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        ))}
        
        {remainingCount > 0 && (
          <ListItem disableGutters sx={{ px: 0 }}>
            <ListItemText
              primary={`+${remainingCount} további termék`}
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: 'text.secondary',
                style: { fontStyle: 'italic' } 
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Card
      title={title}
      subheader={
        <Chip 
          label={`Prioritás: ${getPriorityText(priority)}`} 
          size="small" 
          color={getPriorityColor(priority)}
          sx={{ mt: 1 }}
        />
      }
      content={productsList}
      actions={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Szerkesztés
          </Button>
          
          {onDelete && (
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Törlés
            </Button>
          )}
        </Box>
      }
      elevation={2}
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
      onClick={handleEdit}
    />
  );
};

export default ShoppingListCard; 