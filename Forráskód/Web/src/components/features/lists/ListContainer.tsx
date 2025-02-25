import { ShoppingList, ProductCatalog } from '../../../utils/types';
import ProductItem from '../products/ProductItem';
import { Paper, Typography, Chip, Box, IconButton, Tooltip, LinearProgress, Button, Dialog, DialogActions, DialogContent, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import WarningIcon from '@mui/icons-material/Warning';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import ListService from '../../../services/list.service';
import ProductService from '../../../services/product.service';
import ProductCatalogService from '../../../services/productCatalog.service';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

interface ListContainerProps {
  list: ShoppingList;
  onProductUpdate?: (listId: string, productId: string, updates: any) => void;
  onShare?: (listId: string) => void;
  onEdit?: (listId: string) => void;
  onDelete?: (listId: string) => void;
  currentUser?: { id: string };
}

type PartialProductCatalog = {
  _id: string; 
  name: string; 
  defaultUnit?: string; 
  categoryHierarchy?: string[]
};

export default function ListContainer({ list, onProductUpdate, onShare, onDelete, currentUser }: ListContainerProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [permissionLevel, setPermissionLevel] = useState<'view' | 'edit'>('view');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProductCatalog[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PartialProductCatalog | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productUnit, setProductUnit] = useState('db');
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const handleTogglePurchased = async (productId: string) => {
    try {
      const product = list.products.find(p => p._id === productId);
      if (product) {
        await ListService.updateProductInList(
          list._id, 
          productId, 
          { isPurchased: !product.isPurchased }
        );
        if (onProductUpdate) {
          onProductUpdate(list._id, productId, { isPurchased: !product.isPurchased });
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Hiba a termék állapotának módosításakor');
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) return; // Nem engedünk 1-nél kisebb mennyiséget
      
      await ListService.updateProductInList(
        list._id, 
        productId, 
        { quantity: newQuantity }
      );
      
      if (onProductUpdate) {
        onProductUpdate(list._id, productId, { quantity: newQuantity });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Hiba a termék mennyiségének módosításakor');
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
      setUsername('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Ismeretlen hiba történt');
    }
  };

  const handleDeleteList = async () => {
    try {
      await ListService.deleteList(list._id);
      setDeleteDialogOpen(false);
      onDelete?.(list._id);
      setSuccessMessage('A lista sikeresen törölve!');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Hiba a lista törlésekor');
    }
  };

  const handleEdit = () => {
    navigate(`/lists/${list._id}`);
  };

  const handleAddProductClick = () => {
    setAddProductDialogOpen(true);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearchProducts = async () => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await ProductCatalogService.searchCatalogItems(searchTerm);
      setSearchResults(results);
    } catch (error) {
      setErrorMessage('Hiba a termékek keresésekor');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductSelect = (product: { _id: string; name: string; defaultUnit?: string; categoryHierarchy?: string[] }) => {
    setSelectedProduct(product as unknown as PartialProductCatalog);
    // Alapértelmezett mértékegység beállítása
    setProductUnit(product.defaultUnit || 'db');
  };

  const handleAddProduct = async () => {
    if (!selectedProduct) return;
    
    setIsAdding(true);
    try {
      // Új termék létrehozása a kiválasztott katalóguselemből
      const productData = {
        catalogItem: selectedProduct._id,
        quantity: productQuantity,
        unit: productUnit,
        isPurchased: false
      };
      
      // Termék hozzáadása a listához
      await ListService.addProductToList(list._id, productData);
      
      setSuccessMessage('Termék sikeresen hozzáadva!');
      setAddProductDialogOpen(false);
      
      // A lista újbóli betöltése a komponens frissítése nélkül
      // A valós alkalmazásban célszerű lenne frissíteni a teljes listát
      // Egyelőre csak a sikerüzenetet jelezzük, a frissítésről a fő oldal gondoskodik
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Hiba a termék hozzáadásakor');
    } finally {
      setIsAdding(false);
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
            {list.sharedUsers.length > 0 && <GroupIcon color="action" fontSize="small" />}
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
            <Tooltip title="Termék hozzáadása">
              <IconButton onClick={handleAddProductClick} size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
            <Tooltip title="Törlés">
              <IconButton onClick={() => setDeleteDialogOpen(true)} size="small" color="error">
                <DeleteIcon fontSize="small" />
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
        {list.sharedUsers.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Megosztva: {list.sharedUsers.length} felhasználóval
          </Typography>
        )}
      </Box>

      {list.sharedUsers.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {list.sharedUsers.map(sharedUser => (
            <Chip
              key={sharedUser.user._id}
              label={`${sharedUser.user.username} (${sharedUser.permissionLevel === 'edit' ? 'szerkesztés' : 'megtekintés'})`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      )}

      {/* Lista megosztás párbeszédablak */}
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

      {/* Lista törlés párbeszédablak */}
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

      {/* Termék hozzáadása párbeszédablak */}
      <Dialog open={addProductDialogOpen} onClose={() => setAddProductDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Termék hozzáadása</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', mb: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Termék keresése"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
            />
            <LoadingButton 
              onClick={handleSearchProducts}
              loading={isSearching}
              variant="contained"
              sx={{ ml: 1 }}
            >
              Keresés
            </LoadingButton>
          </Box>

          {searchResults.length > 0 && (
            <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {searchResults.map(product => (
                <Box 
                  key={product._id}
                  sx={{ 
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    ...(selectedProduct?._id === product._id && { bgcolor: 'action.selected' })
                  }}
                  onClick={() => handleProductSelect(product)}
                >
                  <Typography variant="body1">{product.name}</Typography>
                  {product.categoryHierarchy?.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {product.categoryHierarchy.join(' › ')}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {selectedProduct && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Kiválasztott termék:</Typography>
              <Typography variant="body1">{selectedProduct.name}</Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Mennyiség"
                  type="number"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  InputProps={{ inputProps: { min: 1 } }}
                  size="small"
                />
                <TextField
                  label="Mértékegység"
                  value={productUnit}
                  onChange={(e) => setProductUnit(e.target.value)}
                  size="small"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddProductDialogOpen(false)}>Mégse</Button>
          <LoadingButton 
            onClick={handleAddProduct}
            loading={isAdding}
            disabled={!selectedProduct}
            variant="contained"
          >
            Hozzáadás
          </LoadingButton>
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