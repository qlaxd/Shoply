import { Product } from '../../../utils/types';
import { Box, Typography, Checkbox, Skeleton, IconButton, Tooltip } from '@mui/material';
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

  const handleDecrement = () => {
    if (product.quantity > 1) {
      onQuantityChange?.(product._id, product.quantity - 1);
    }
  };
  
  const handleIncrement = () => onQuantityChange?.(product._id, product.quantity + 1);

  // Ha nem töltött be a termék vagy hiányzik a catalogItem, akkor betöltő állapotot mutatunk
  if (!product || !product._id) {
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

  // A termék neve alapján: ha van catalogItem, annak nevét használjuk, egyébként a termék _id-ját vagy üres stringet
  const productName = product.catalogItem?.name || product._id || '';
  // A kategóriahierarchia kezelése
  const categoryHierarchy = product.catalogItem?.categoryHierarchy || [];
  // Mértékegység meghatározása (ha nincs megadva, db az alapértelmezett)
  const unitToDisplay = product.unit || product.catalogItem?.defaultUnit || 'db';

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
        <Tooltip 
          title={
            <>
              {product.notes && <Typography variant="body2">{product.notes}</Typography>}
              {categoryHierarchy.length > 0 && categoryHierarchy.join(' › ')}
            </>
          }
          arrow
        >
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
            {productName}
            {product.priority === 'HIGH' && (
              <FiberManualRecord color="error" sx={{ fontSize: '0.8rem' }} />
            )}
          </Typography>
        </Tooltip>
        
        {categoryHierarchy.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Category fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {categoryHierarchy.join(' › ')}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        padding: '2px 8px'
      }}>
        <IconButton 
          size="medium" 
          onClick={handleDecrement}
          sx={{ p: 0.5 }}
          disabled={product.quantity <= 1}
        >
          <RemoveDone fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: '24px', textAlign: 'center' }}>
          {product.quantity} {unitToDisplay}
        </Typography>
        <IconButton 
          size="medium" 
          onClick={handleIncrement}
          sx={{ p: 0.5 }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ProductItem;