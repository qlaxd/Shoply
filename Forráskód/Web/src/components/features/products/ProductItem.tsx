import { Product } from '../../../types';
import { Box, Typography, Checkbox, Chip } from '@mui/material';

interface ProductItemProps {
  product: Product;
  onTogglePurchased?: (productId: string) => void;
}

const ProductItem = ({ product, onTogglePurchased }: ProductItemProps) => {
  const handleToggle = () => {
    if (onTogglePurchased) {
      onTogglePurchased(product._id);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Checkbox 
          checked={product.isPurchased}
          onChange={handleToggle}
          color="success"
        />
        <Box>
          <Typography 
            sx={{ 
              textDecoration: product.isPurchased ? 'line-through' : 'none',
              color: product.isPurchased ? 'text.secondary' : 'text.primary'
            }}
          >
            {product.catalogItem.name}
          </Typography>
          {product.catalogItem.categoryHierarchy.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {product.catalogItem.categoryHierarchy.join(' > ')}
            </Typography>
          )}
        </Box>
      </Box>
      <Chip 
        label={`${product.quantity} ${product.catalogItem.defaultUnit}`}
        size="small"
        variant="outlined"
        color={product.isPurchased ? 'success' : 'default'}
      />
    </Box>
  );
}

export default ProductItem;