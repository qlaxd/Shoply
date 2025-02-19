import { ShoppingList } from '../../../types';
import ProductItem from '../products/ProductItem';
import { Paper, Typography, Chip, Box, IconButton, Tooltip } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

interface ListContainerProps {
  list: ShoppingList;
  onProductUpdate?: (listId: string, productId: string, updates: any) => void;
  onShare?: (listId: string) => void;
}

export default function ListContainer({ list, onProductUpdate, onShare }: ListContainerProps) {
  const handleTogglePurchased = (productId: string) => {
    if (onProductUpdate) {
      const product = list.products.find(p => p._id === productId);
      if (product) {
        onProductUpdate(list._id, productId, { isPurchased: !product.isPurchased });
      }
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(list._id);
    }
  };

  const purchasedCount = list.products.filter(p => p.isPurchased).length;
  const totalCount = list.products.length;
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6">{list.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            Létrehozva: {format(new Date(list.createdAt), 'yyyy. MMMM d.', { locale: hu })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={`${purchasedCount}/${totalCount} megvásárolva`}
            color={progress === 100 ? 'success' : progress > 50 ? 'warning' : 'default'}
          />
          <Tooltip title="Lista megosztása">
            <IconButton onClick={handleShare} size="small">
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        {list.products.map((product, index) => (
          <ProductItem 
            key={product._id || `product-${list._id}-${index}`} 
            product={product}
            onTogglePurchased={handleTogglePurchased}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Létrehozta: {list.owner.username}
        </Typography>
        {list.sharedWith.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Megosztva: {list.sharedWith.length} felhasználóval
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
