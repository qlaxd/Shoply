import { Product } from '../../../utils/types';
import { Box, Typography, Checkbox, Skeleton, IconButton } from '@mui/material';
import { FiberManualRecord, Category, RemoveDone, Add } from '@mui/icons-material';


interface ProductItemProps {
  product: Product;
  onTogglePurchased?: (productId: string) => void;
  onQuantityChange?: (productId: string, newQuantity: number) => void;
}

const ProductItem = ({ product, onTogglePurchased, onQuantityChange }: ProductItemProps) => {
  const handleToggle = () => {
    if (onTogglePurchased) {
      onTogglePurchased(product._id);
    }
  };

  const handleDecrement = () => onQuantityChange?.(product._id, product.quantity - 1);
  const handleIncrement = () => onQuantityChange?.(product._id, product.quantity + 1);

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
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      p: 1.5,
      borderRadius: 1,
      transition: 'background-color 0.2s',
      '&:hover': { bgcolor: 'action.hover' }
    }}>
      <Checkbox 
        checked={product.isPurchased}
        onChange={handleToggle}
        color="success"
        sx={{ 
          '& .MuiSvgIcon-root': { fontSize: 28 },
          ...(product.isPurchased && {
            color: 'success.main',
            '&.Mui-checked': { color: 'success.main' }
          })
        }}
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body1"
          sx={{
            fontWeight: 500,
            textDecoration: product.isPurchased ? 'line-through' : 'none',
            color: product.isPurchased ? 'text.disabled' : 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {product.catalogItem.name}
          {product.priority === 'HIGH' && (
            <FiberManualRecord color="error" sx={{ fontSize: '0.8rem' }} />
          )}
        </Typography>
        
        {product.catalogItem.categoryHierarchy?.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Category fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {product.catalogItem.categoryHierarchy.join(' › ')}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton size="small" onClick={handleDecrement}>
          <RemoveDone fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: '24px', textAlign: 'center' }}>
          {product.quantity}
        </Typography>
        <IconButton size="small" onClick={handleIncrement}>
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ProductItem;