import { Product } from '../../../types';
import { Box, Typography, Checkbox, Chip, Skeleton } from '@mui/material';

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

  // Ha nincs catalogItem, akkor egy betöltő állapotot mutatunk
  if (!product.catalogItem) {
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
          <Checkbox disabled />
          <Box>
            <Skeleton width={150} height={24} />
            <Skeleton width={100} height={20} />
          </Box>
        </Box>
        <Skeleton width={80} height={32} />
      </Box>
    );
  }

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
          {product.catalogItem.categoryHierarchy?.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {product.catalogItem.categoryHierarchy.join(' > ')}
            </Typography>
          )}
        </Box>
      </Box>
      <Chip 
        label={`${product.quantity} ${product.catalogItem.defaultUnit || 'db'}`}
        size="small"
        variant="outlined"
        color={product.isPurchased ? 'success' : 'default'}
      />
    </Box>
  );
}

export default ProductItem;