import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Alert, 
  Box, 
  Container 
} from '@mui/material';
import UserService from '../../../services/user.service';
import AuthService from '../../../services/auth.service';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Tisztítsuk a validációs hibákat a mezőváltoztatáskor
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'A jelenlegi jelszó megadása kötelező';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'Az új jelszó megadása kötelező';
    } else {
      try {
        AuthService.validatePassword(formData.newPassword);
      } catch (err) {
        errors.newPassword = err.message;
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'A két jelszó nem egyezik meg';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await UserService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSuccess('A jelszó sikeresen módosítva!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Hiba történt a jelszó módosítása során: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Jelszó módosítása
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Jelenlegi jelszó"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              error={!!validationErrors.currentPassword}
              helperText={validationErrors.currentPassword}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Új jelszó"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={!!validationErrors.newPassword}
              helperText={validationErrors.newPassword || 
                "A jelszónak legalább 10 karakter hosszúnak kell lennie, tartalmaznia kell nagybetűt, kisbetűt és számot."}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Új jelszó megerősítése"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="contained" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Mentés...' : 'Jelszó módosítása'}
              </Button>
              <Button 
                variant="outlined" 
                href="/profile"
              >
                Vissza a profilra
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ChangePassword; 