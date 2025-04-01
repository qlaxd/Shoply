import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Alert, 
  Box, 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  InputAdornment, 
  CircularProgress, 
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Person as PersonIcon, 
  Email as EmailIcon 
} from '@mui/icons-material';
import UserService from '../../../services/user.service';

const UserSearch = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Kérlek adj meg egy keresési kifejezést');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await UserService.searchUsers(searchTerm);
      setResults(data);
      setSearched(true);
    } catch (err) {
      setError('Hiba történt a felhasználók keresése során: ' + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    if (onSelectUser && typeof onSelectUser === 'function') {
      onSelectUser(user);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Felhasználók keresése
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Keresés felhasználónév vagy e-mail cím alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button 
                      variant="contained" 
                      type="submit" 
                      disabled={loading}
                      sx={{ minWidth: '40px' }}
                    >
                      {loading ? <CircularProgress size={24} /> : <SearchIcon />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Minimum 3 karakter megadása szükséges a kereséshez.
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {searched && (
        <Card>
          <CardHeader title="Keresési eredmények" />
          <Divider />
          <List>
            {results.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="Nincs találat a megadott keresési feltételre" 
                  sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}
                />
              </ListItem>
            ) : (
              results.map(user => (
                <ListItem 
                  key={user._id}
                  button
                  onClick={() => handleUserSelect(user)}
                  divider
                >
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">{user.username}</Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" component="span" color="text.secondary">{user.email}</Typography>
                      </Box>
                    }
                  />
                  {user.name && (
                    <Typography variant="body2">{user.name}</Typography>
                  )}
                </ListItem>
              ))
            )}
          </List>
        </Card>
      )}
    </Container>
  );
};

export default UserSearch; 