import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { blue } from '@mui/material/colors';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Placeholder user data - replace with actual auth data
  const user = {
    name: 'Felhasználó',
    email: 'felhasznalo@example.com'
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    handleMenuClose();
    // Navigate to login page
    navigate('/login');
  };

  const handleProfileClick = () => {
    // TODO: Navigate to profile page
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <ShoppingBasketIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Listáim
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Listák
            </Button>
            
            <Avatar 
              onClick={handleMenuOpen} 
              sx={{ 
                bgcolor: blue[300],
                cursor: 'pointer'
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfileClick}>Profilom</MenuItem>
              <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 