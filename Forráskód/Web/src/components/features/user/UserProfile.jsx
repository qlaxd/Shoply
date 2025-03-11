import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Alert, 
  Box, 
  Container 
} from '@mui/material';
import UserService from '../../../services/user.service';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await UserService.getCurrentUser();
        setUserData(data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          name: data.name || ''
        });
      } catch (err) {
        setError('Hiba történt a felhasználói adatok betöltése során: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await UserService.updateProfile(formData);
      setSuccess('A profil sikeresen frissítve!');
      
      // Frissítsük az adatokat
      const updatedUser = await UserService.getCurrentUser();
      setUserData(updatedUser);
    } catch (err) {
      setError('Hiba történt a profil frissítése során: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return <Box textAlign="center" my={5}>Betöltés...</Box>;
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Felhasználói profil
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Felhasználónév"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled
                  helperText="A felhasználónév nem módosítható"
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email cím"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teljes név"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Add meg a teljes nevedet"
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="contained" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Mentés...' : 'Profil mentése'}
              </Button>
              <Button 
                variant="outlined" 
                href="/profile/change-password"
              >
                Jelszó módosítása
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile; 