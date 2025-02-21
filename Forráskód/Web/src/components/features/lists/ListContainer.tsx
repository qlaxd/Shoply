import { ShoppingList } from '../../../utils/types';
import ProductItem from '../products/ProductItem';
import { Paper, Typography, Chip, Box, IconButton, Tooltip, LinearProgress, Button, Dialog, DialogActions, DialogContent, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, DialogTitle } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import WarningIcon from '@mui/icons-material/Warning';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import ListService from '../../../services/list.service';
import { useNavigate } from 'react-router-dom';

interface ListContainerProps {
  list: ShoppingList;
  onProductUpdate?: (listId: string, productId: string, updates: any) => void;
  onShare?: (listId: string) => void;
  onEdit?: (listId: string) => void;
  onDelete?: (listId: string) => void;
  currentUser?: { id: string };
}

export default function ListContainer({ list, onProductUpdate, onShare, onDelete, currentUser }: ListContainerProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'view' | 'edit'>('view');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleTogglePurchased = (productId: string) => {
    if (onProductUpdate) {
      const product = list.products.find(p => p._id === productId);
      if (product) {
        onProductUpdate(list._id, productId, { isPurchased: !product.isPurchased });
      }
    }
  };

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  const handleShareSubmit = async () => {
    try {
      await ListService.shareList(list._id, username, permissionLevel);
      setShareDialogOpen(false);
      onShare?.(list._id);
      setSuccessMessage('A lista sikeresen megosztva!');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Ismeretlen hiba történt');
      setSuccessMessage(null);
    }
  };

  const handleDeleteList = async () => {
    try {
      await ListService.deleteList(list._id);
      onDelete?.(list._id);
      setSuccessMessage('A lista sikeresen törölve!');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Hiba a lista törlésekor');
    }
  };

  const handleEdit = () => {
    navigate(`/lists/${list._id}`);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (onProductUpdate) {
      onProductUpdate(list._id, productId, { quantity: newQuantity });
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
              <IconButton onClick={handleShareClick} size="small">
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
              onQuantityChange={handleQuantityChange}
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

      {list.sharedWith.map(sharedUser => (
        <Chip
          key={sharedUser.user._id}
          label={sharedUser.user.username}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.75rem' }}
        />
      ))}

      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Lista megosztása</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Felhasználónév"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Jogosultság szintje</InputLabel>
            <Select
              value={permissionLevel}
              label="Jogosultság szintje"
              onChange={(e) => setPermissionLevel(e.target.value as 'view' | 'edit')}
            >
              <MenuItem value="view">Megtekintés</MenuItem>
              <MenuItem value="edit">Szerkesztés</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Mégse</Button>
          <Button onClick={handleShareSubmit} variant="contained">Megosztás</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Lista törlése</DialogTitle>
        <DialogContent>
          <Typography>Biztosan törölni szeretnéd ezt a listát?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Mégse</Button>
          <Button onClick={handleDeleteList} color="error" variant="contained">
            Törlés
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={() => {
          setSuccessMessage(null);
          setErrorMessage(null);
        }}
      >
        <Alert severity={successMessage ? "success" : "error"} sx={{ width: '100%' }}>
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
