import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  useTheme,
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Fade,
  CircularProgress,
  AvatarGroup,
  Paper,
  Alert,
  Snackbar,
  useMediaQuery,
  Collapse,
  Zoom,
  LinearProgress
} from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CommentIcon from '@mui/icons-material/Comment';

// Common komponensek importálása
import Card from '../../common/Card';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import Input from '../../common/Input';

// Services importálása
import ListService from '../../../services/list.service';
import UserService from '../../../services/user.service';

// Színek meghatározása a prioritás számára és az avatárokhoz
const getAvatarColor = (name) => {
  // Ensure we have a string value to work with
  if (!name || typeof name !== 'string') {
    // Default color for undefined, null, or non-string values
    return '#2196f3';
  }
  
  const colors = [
    '#2196f3', // blue
    '#ff9800', // orange
    '#4caf50', // green
    '#9c27b0', // purple
    '#f44336'  // red
  ];
  
  // A név alapján választunk egy színt
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length]; 
};

// Avatár betű generálása
const getAvatarLetter = (name) => {
  // Handle object with username property
  if (typeof name === 'object' && name !== null) {
    if (name.username && typeof name.username === 'string') {
      return name.username.charAt(0).toUpperCase();
    }
    return '';
  }
  
  // Handle string values
  if (typeof name === 'string' && name.length > 0) {
    return name.charAt(0).toUpperCase();
  }
  
  // Default for non-string values
  return '';
};

// Prioritás szín meghatározása
const getPriorityColor = (priority) => {
  switch(priority) {
    case 1: return 'error';
    case 2: return 'warning';
    case 3: 
    default: return 'info';
  }
};

// Prioritás szöveg és háttérszín meghatározása
const getPriorityInfo = (priority) => {
  switch(priority) {
    case 1: 
      return { 
        text: 'Magas',
        color: '#ffebee', // Halvány piros
        textColor: '#d32f2f'
      };
    case 2: 
      return { 
        text: 'Közepes',
        color: '#fff8e1', // Halvány sárga
        textColor: '#f57c00'
      };
    case 3: 
    default: 
      return { 
        text: 'Alacsony',
        color: '#e1f5fe', // Halvány kék
        textColor: '#0288d1'
      };
  }
};

const ShoppingListCard = ({ list, onEdit, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { _id, title, products = [], priority, sharedWith = [] } = list || {};
  
  // Make sure products and sharedWith are always arrays
  const safeProducts = Array.isArray(products) ? products : [];
  const safeSharedWith = Array.isArray(sharedWith) ? sharedWith : [];
  
  // Állapotok
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUsername, setShareUsername] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [permissionLevel, setPermissionLevel] = useState('view');
  const [shareMethod, setShareMethod] = useState('username'); // 'username', 'email'
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedView, setExpandedView] = useState(false);
  
  // Csak az első 3 terméket jelenítjük meg a kártyán
  const displayProducts = expandedView ? safeProducts : safeProducts.slice(0, 3);
  const remainingCount = safeProducts.length - (expandedView ? safeProducts.length : displayProducts.length);
  
  // Kiszámoljuk a megvásárolt termékek arányát
  const purchasedCount = safeProducts.filter(p => p?.isPurchased).length;
  const completionPercentage = safeProducts.length > 0 
    ? Math.round((purchasedCount / safeProducts.length) * 100) 
    : 0;

  // Menü kezelése
  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    if (e) e.stopPropagation();
    setMenuAnchorEl(null);
  };

  // Szerkesztés és törlés kezelése
  const handleEdit = (e) => {
    e.stopPropagation();
    handleMenuClose(e);
    onEdit(_id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleMenuClose(e);
    if (onDelete) {
      onDelete(_id);
    }
  };

  // Megosztás kezelése
  const handleShareOpen = (e) => {
    e.stopPropagation();
    handleMenuClose(e);
    setShareDialogOpen(true);
    setShareUsername('');
    setShareEmail('');
    setSearchResults([]);
    setError(null);
    setShareSuccess(false);
    setPermissionLevel('view');
    setShareMethod('username');
  };

  const handleShareClose = (e) => {
    if (e) e.stopPropagation();
    setShareDialogOpen(false);
  };

  // Felhasználó keresés
  const handleUserSearch = async (query) => {
    if (query.trim().length >= 2) {
      try {
        setSearching(true);
        setError(null);
        
        const results = await UserService.searchUsers(query);
        
        if (Array.isArray(results)) {
          // Kiszűrjük azokat a felhasználókat, akikkel már meg van osztva a lista
          const filteredResults = results.filter(user => 
            !safeSharedWith.some(shared => 
              shared._id === user._id || shared.id === user._id || shared === user._id
            )
          );
          
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Hiba a felhasználók keresésekor:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Lista megosztása
  const handleShareList = async () => {
    if (shareMethod === 'username' && !shareUsername.trim()) return;
    if (shareMethod === 'email' && !shareEmail.trim()) return;
    
    try {
      setSharing(true);
      setError(null);
      
      let shareTarget = shareMethod === 'username' ? shareUsername : shareEmail;
      
      // Megosztás a kiválasztott jogosultsággal
      await ListService.shareList(_id, shareTarget, permissionLevel);
      
      setShareSuccess(true);
      setShareUsername('');
      setShareEmail('');
      setSearchResults([]);
      
      const successMessage = `A lista sikeresen megosztva ${shareTarget} címzettnek ${permissionLevel === 'view' ? 'olvasási' : 'szerkesztési'} jogosultsággal!`;
      setSnackbarMessage(successMessage);
      
      // 2 másodperc múlva bezárjuk a dialógust
      setTimeout(() => {
        setShareDialogOpen(false);
        setShareSuccess(false);
        setShowSnackbar(true);
      }, 2000);
      
    } catch (err) {
      console.error('Hiba a lista megosztásakor:', err);
      setError(err.message || 'Nem sikerült megosztani a listát');
    } finally {
      setSharing(false);
    }
  };

  // Lista megosztás visszavonása
  const handleRemoveSharing = async (userId) => {
    try {
      // Ensure we have a valid userId
      if (!userId) {
        setError('Érvénytelen felhasználói azonosító');
        return;
      }
      
      setSharing(true);
      await ListService.unshareList(_id, userId);
      
      // Mivel a lista objektumot közvetlenül nem frissítjük, csak egy üzenetet jelenítünk meg
      setSnackbarMessage('A megosztás sikeresen visszavonva!');
      setShowSnackbar(true);
      setShareDialogOpen(false);
    } catch (err) {
      console.error('Hiba a megosztás visszavonása során:', err);
      setError(err.message || 'Nem sikerült visszavonni a megosztást');
    } finally {
      setSharing(false);
    }
  };

  // Felhasználó kiválasztása a keresési eredményekből
  const handleSelectUser = (username) => {
    setShareUsername(username);
    setSearchResults([]);
  };

  // Megosztási mód váltása
  const handleShareMethodChange = (method) => {
    setShareMethod(method);
    setSearchResults([]);
  };

  // Bővített nézet kapcsolása
  const toggleExpandedView = (e) => {
    e.stopPropagation();
    setExpandedView(!expandedView);
  };

  // Snackbar bezárása
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Prioritás háttere
  const priorityInfo = getPriorityInfo(priority);

  // Kártya tartalom
  const productsList = (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge 
            badgeContent={safeProducts.length} 
            color="primary"
            sx={{ mr: 1 }}
          >
            <ShoppingBasketIcon color="action" />
          </Badge>
          <Typography variant="body2" color="text.secondary">
            {purchasedCount > 0 ? `${purchasedCount}/${safeProducts.length} megvásárolva` : `${safeProducts.length} termék`}
          </Typography>
        </Box>
        
        {safeProducts.length > 0 && (
          <Tooltip title={`${completionPercentage}% kész`}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress 
                variant="determinate" 
                value={completionPercentage} 
                size={24} 
                thickness={6}
                sx={{ color: completionPercentage === 100 ? 'success.main' : 'primary.main' }}
              />
              {completionPercentage === 100 && (
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                </Box>
              )}
            </Box>
          </Tooltip>
        )}
      </Box>
      
      {safeSharedWith && safeSharedWith.length > 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'rgba(0, 0, 0, 0.04)'
          }}
        >
          <PeopleIcon sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />
          <AvatarGroup 
            max={3} 
            sx={{ 
              '& .MuiAvatar-root': { 
                width: 20, 
                height: 20, 
                fontSize: '0.75rem',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' 
              } 
            }}
          >
            {safeSharedWith.map((user, index) => {
              // Extract username safely for both object and string user values
              const username = typeof user === 'object' && user !== null
                ? (user.username || 'User')
                : (typeof user === 'string' ? user : 'User');
                
              return (
                <Tooltip 
                  key={index} 
                  title={username}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(username)
                    }}
                  >
                    {getAvatarLetter(username)}
                  </Avatar>
                </Tooltip>
              );
            })}
          </AvatarGroup>
        </Box>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      <List dense sx={{ pt: 0 }}>
        {displayProducts.map((product) => {
          // Extract addedBy information safely
          const addedByName = typeof product.addedBy === 'object' && product.addedBy !== null
            ? (product.addedBy.username || 'User')
            : (typeof product.addedBy === 'string' ? product.addedBy : 'User');
            
          return (
            <ListItem key={product._id || product.id} disableGutters sx={{ px: 0 }}>
              <Avatar 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  mr: 1, 
                  fontSize: '0.8rem',
                  bgcolor: getAvatarColor(addedByName),
                  opacity: product.isPurchased ? 0.6 : 1
                }}
              >
                {getAvatarLetter(addedByName)}
              </Avatar>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{ 
                        textDecoration: product.isPurchased ? 'line-through' : 'none',
                        color: product.isPurchased ? 'text.disabled' : 'text.primary'
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Chip 
                      label={`${product.quantity || 1} ${product.unit || 'db'}`}
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                    />
                    {product.notes && (
                      <Tooltip title={product.notes}>
                        <CommentIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.9rem' }} />
                      </Tooltip>
                    )}
                  </Box>
                }
                secondary={`Hozzáadta: ${typeof product.addedBy === 'object' && product.addedBy !== null
                  ? product.addedBy.username || 'Ismeretlen'
                  : product.addedBy || 'Ismeretlen'}`}
                primaryTypographyProps={{ 
                  variant: 'body2'
                }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          );
        })}
        
        {remainingCount > 0 && (
          <ListItem 
            disableGutters 
            sx={{ px: 0 }}
            button
            onClick={toggleExpandedView}
          >
            <ListItemText
              primary={`${expandedView ? 'Kevesebb termék mutatása' : `+${remainingCount} további termék`}`}
              primaryTypographyProps={{ 
                variant: 'body2', 
                color: 'primary',
                style: { fontStyle: 'italic' } 
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Card
        title={title}
        titleAction={
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            sx={{ 
              ml: 1,
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'rotate(90deg)' }
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        }
        subheader={
          <Chip 
            label={`Prioritás: ${priorityInfo.text}`} 
            size="small" 
            color={getPriorityColor(priority)}
            sx={{ 
              mt: 1,
              fontWeight: 'medium',
              backgroundColor: priorityInfo.color,
              color: priorityInfo.textColor
            }}
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
              sx={{ 
                borderRadius: 8,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 1
                }
              }}
            >
              {isMobile ? 'Szerk.' : 'Szerkesztés'}
            </Button>
            
            <Button 
              size="small" 
              variant="outlined" 
              color="secondary"
              startIcon={<ShareIcon />}
              onClick={handleShareOpen}
              sx={{ 
                borderRadius: 8,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 1
                }
              }}
            >
              {isMobile ? 'Megoszt' : 'Megosztás'}
            </Button>
          </Box>
        }
        elevation={2}
        sx={{ 
          height: '100%',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8]
          }
        }}
        onClick={() => onEdit(_id)}
      />

      {/* Műveletek menü */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, minWidth: 180 }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Szerkesztés</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShareOpen}>
          <ListItemIcon>
            <ShareIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText>Megosztás</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(title);
          setSnackbarMessage('Lista neve vágólapra másolva!');
          setShowSnackbar(true);
        }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cím másolása</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Törlés</ListItemText>
        </MenuItem>
      </Menu>

      {/* Megosztás dialógus */}
      <Modal
        open={shareDialogOpen}
        onClose={handleShareClose}
        title="Lista megosztása"
        maxWidth="sm"
        actions={
          <>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleShareClose}
              disabled={sharing}
              sx={{ borderRadius: 8 }}
            >
              Mégse
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleShareList}
              disabled={(shareMethod === 'username' && !shareUsername.trim()) || 
                       (shareMethod === 'email' && !shareEmail.trim()) || 
                       sharing}
              startIcon={sharing ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              sx={{ borderRadius: 8 }}
            >
              {sharing ? 'Megosztás...' : 'Megosztás'}
            </Button>
          </>
        }
      >
        {shareSuccess ? (
          <Fade in={shareSuccess}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              py: 2
            }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" color="success.main">
                Sikeres megosztás!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                A lista sikeresen megosztva a felhasználóval.
              </Typography>
            </Box>
          </Fade>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add meg annak a felhasználónak a nevét vagy email címét, akivel meg szeretnéd osztani a listát.
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setError(null)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  display: 'flex',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                <Button
                  fullWidth
                  variant={shareMethod === 'username' ? 'contained' : 'text'}
                  onClick={() => handleShareMethodChange('username')}
                  startIcon={<PermIdentityIcon />}
                  sx={{ py: 1, borderRadius: 0 }}
                >
                  Felhasználónév
                </Button>
                <Divider orientation="vertical" flexItem />
                <Button
                  fullWidth
                  variant={shareMethod === 'email' ? 'contained' : 'text'}
                  onClick={() => handleShareMethodChange('email')}
                  startIcon={<EmailIcon />}
                  sx={{ py: 1, borderRadius: 0 }}
                >
                  Email
                </Button>
              </Paper>
              
              {shareMethod === 'username' ? (
                <Input
                  autoFocus
                  fullWidth
                  label="Felhasználónév"
                  placeholder="Kezdj el gépelni a kereséshez..."
                  value={shareUsername}
                  onChange={(e) => {
                    setShareUsername(e.target.value);
                    handleUserSearch(e.target.value);
                  }}
                  startIcon={<SearchIcon />}
                  sx={{ 
                    '& .MuiInputBase-root': {
                      borderRadius: 2
                    }
                  }}
                  endAdornment={searching ? <CircularProgress size={20} /> : null}
                />
              ) : (
                <Input
                  autoFocus
                  fullWidth
                  label="Email cím"
                  placeholder="pelda@email.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  type="email"
                  startIcon={<EmailIcon />}
                  sx={{  
                    '& .MuiInputBase-root': {
                      borderRadius: 2
                    }
                  }}
                />
              )}
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Jogosultság
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3
              }}
            >
              <Button
                fullWidth
                variant={permissionLevel === 'view' ? 'contained' : 'text'}
                onClick={() => setPermissionLevel('view')}
                sx={{ py: 1, borderRadius: 0 }}
              >
                Olvasás
              </Button>
              <Divider orientation="vertical" flexItem />
              <Button
                fullWidth
                variant={permissionLevel === 'edit' ? 'contained' : 'text'}
                onClick={() => setPermissionLevel('edit')}
                sx={{ py: 1, borderRadius: 0 }}
              >
                Szerkesztés
              </Button>
            </Paper>
            
            {searchResults.length > 0 && shareMethod === 'username' && (
              <Box sx={{ 
                maxHeight: 200, 
                overflow: 'auto', 
                mb: 3, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2 
              }}>
                <List dense>
                  {searchResults.map((user) => {
                    // Make sure user has valid username and email properties
                    const username = user?.username || 'User';
                    const email = user?.email || '';
                    
                    return (
                      <ListItem 
                        key={user._id || `search-${Math.random()}`} 
                        button 
                        onClick={() => handleSelectUser(username)}
                        sx={{
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1, 
                            bgcolor: getAvatarColor(username),
                            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {getAvatarLetter(username)}
                        </Avatar>
                        <ListItemText 
                          primary={username} 
                          secondary={email} 
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
            
            {safeSharedWith && safeSharedWith.length > 0 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                  <Typography variant="subtitle2">
                    Már megosztva ezekkel a felhasználókkal:
                  </Typography>
                  <Chip 
                    label={`${safeSharedWith.length} felhasználó`} 
                    size="small" 
                    color="primary" 
                  />
                </Box>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    maxHeight: 200,
                    overflow: 'auto'  
                  }}
                >
                  <List dense>
                    {safeSharedWith.map((user, index) => {
                      // Safely extract username for display and color
                      const username = typeof user === 'object' && user !== null
                        ? (user.username || 'User')
                        : (typeof user === 'string' ? user : 'User');
                        
                      return (
                        <ListItem 
                          key={index}
                          secondaryAction={
                            <IconButton 
                              edge="end" 
                              size="small"
                              onClick={() => handleRemoveSharing(
                                typeof user === 'object' && user !== null ? user._id || user.id : user
                              )}
                              sx={{ color: 'error.light' }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          }
                        >
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 1, 
                              bgcolor: getAvatarColor(username)
                            }}
                          >
                            {getAvatarLetter(username)}
                          </Avatar>
                          <ListItemText 
                            primary={username} 
                            secondary={typeof user === 'object' && user !== null ? user.email : null}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </>
            )}
          </>
        )}
      </Modal>

      {/* Értesítés sikeres műveletről */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          icon={<NotificationsActiveIcon />}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShoppingListCard; 