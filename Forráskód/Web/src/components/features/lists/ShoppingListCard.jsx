import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  CardActionArea,
  Avatar
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { blue, orange, green } from '@mui/material/colors';

const getAvatarColor = (name) => {
  const colors = [blue[500], orange[500], green[500]];
  // Simple hash function to get a consistent color for a name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const ShoppingListCard = ({ list, onEdit }) => {
  const { title, products, priority } = list;
  
  // Show only first 3 products in the card
  const displayProducts = products.slice(0, 3);
  const remainingCount = products.length - displayProducts.length;

  return (
    <Card className="list-card" onClick={() => onEdit(list.id)}>
      <CardActionArea>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h2" className="list-card-title">
              {title}
            </Typography>
            <Chip 
              label={`Prioritás: ${priority}`} 
              size="small" 
              color={priority === 1 ? "error" : priority === 2 ? "warning" : "info"}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ShoppingBasketIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {products.length} termék
            </Typography>
          </Box>
          
          <List dense className="list-card-products">
            {displayProducts.map((product) => (
              <ListItem key={product.id} disableGutters>
                <Avatar 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    mr: 1, 
                    fontSize: '0.8rem',
                    bgcolor: getAvatarColor(product.addedBy)
                  }}
                >
                  {product.addedBy.charAt(0)}
                </Avatar>
                <ListItemText 
                  primary={product.name} 
                  secondary={`Hozzáadta: ${product.addedBy}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}
            
            {remainingCount > 0 && (
              <ListItem disableGutters>
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ShoppingListCard; 