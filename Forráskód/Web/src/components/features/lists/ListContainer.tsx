import { ShoppingList } from '../../../utils/types';
import ProductItem from '../products/ProductItem';
import { Paper, Typography, Chip, Box, IconButton, Tooltip, LinearProgress } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import WarningIcon from '@mui/icons-material/Warning';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { alpha } from '@mui/material/styles';

interface ListContainerProps {
  list: ShoppingList;
  onProductUpdate?: (listId: string, productId: string, updates: any) => void;
  onShare?: (listId: string) => void;
  onEdit?: (listId: string) => void;
}

export default function ListContainer({ list, onProductUpdate, onShare, onEdit }: ListContainerProps) {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(list._id);
    }
  };

  const purchasedCount = list.products.filter(p => p.isPurchased).length;
  const totalCount = list.products.length;
  const progress = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        position: 'relative'
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            {list.name}
            {list.priority === 'HIGH' && <WarningIcon color="error" fontSize="small" />}
            {list.sharedWith.length > 0 && <GroupIcon color="action" fontSize="small" />}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <AccessTimeIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            {format(new Date(list.updatedAt), 'HH:mm', { locale: hu })} | 
            {format(new Date(list.createdAt), 'yyyy. MMMM d.', { locale: hu })}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${purchasedCount}/${totalCount}`}
            color={progress === 100 ? 'success' : 'default'}
            variant="outlined"
            sx={{ 
              fontWeight: 700,
              ...(progress === 100 && {
                borderColor: theme => theme.palette.success.main,
                bgcolor: theme => alpha(theme.palette.success.main, 0.1)
              })
            }}
          />
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Szerkesztés">
              <IconButton onClick={handleEdit} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Megosztás">
              <IconButton onClick={handleShare} size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mb: 1 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          color={progress === 100 ? 'success' : progress > 50 ? 'warning' : 'primary'}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Box sx={{ mb: 2, maxHeight: 400, overflowY: 'auto' }}>
        {list.products.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            Nincsenek termékek a listában
          </Typography>
        ) : (
          list.products.map((product, index) => (
            <ProductItem 
              key={product._id || `product-${list._id}-${index}`} 
              product={product}
              onTogglePurchased={handleTogglePurchased}
            />
          ))
        )}
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
