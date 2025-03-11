import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Alert, 
  Box, 
  Container, 
  Button, 
  Grid, 
  CircularProgress, 
  Chip, 
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  CalendarToday as CalendarIcon, 
  ListAlt as ListIcon 
} from '@mui/icons-material';
import UserService from '../../../services/user.service';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('Felhasználó azonosító nem található');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await UserService.getUserById(userId);
        setUserData(data);
      } catch (err) {
        setError('Hiba történt a felhasználói adatok betöltése során: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate(-1)}>Vissza</Button>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>A felhasználó nem található</Alert>
        <Button variant="contained" onClick={() => navigate(-1)}>Vissza</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2">
          Felhasználói adatok
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>Vissza</Button>
      </Box>
      
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5">{userData.username}</Typography>
              <Chip 
                label={userData.role === 'admin' ? 'Adminisztrátor' : 'Felhasználó'} 
                color={userData.role === 'admin' ? 'error' : 'primary'}
                sx={{ mt: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Személyes adatok
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Teljes név" 
                    secondary={userData.name || 'Nincs megadva'} 
                  />
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email cím" 
                    secondary={userData.email} 
                  />
                </ListItem>
                
                <Divider component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Regisztráció dátuma" 
                    secondary={new Date(userData.createdAt).toLocaleDateString('hu-HU')} 
                  />
                </ListItem>
                
                {userData.stats && (
                  <>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemIcon>
                        <ListIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Listák száma" 
                        secondary={userData.stats.listCount || 0} 
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserDetails; 