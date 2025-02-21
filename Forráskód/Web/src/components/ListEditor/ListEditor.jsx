import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import ListService from '../../services/list.service';
import { useNavigate } from 'react-router-dom';

const ListEditor = ({ list, onSave }) => {
  const [listName, setListName] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (list) {
      setListName(list.name);
      setPriority(list.priority || 'NORMAL');
    }
  }, [list]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (list) {
        await ListService.updateList(list._id, {
          name: listName,
          priority
        });
      } else {
        const newList = await ListService.createList({
          name: listName,
          priority
        });
        navigate(`/lists/${newList._id}`);
      }
      onSave?.();
      setSuccessMessage(list ? 'A lista sikeresen frissítve!' : 'A lista sikeresen létrehozva!');
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message || 'Hiba történt a mentés során');
      setSuccessMessage(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Lista szerkesztése</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Lista neve"
          variant="outlined"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          margin="normal"
          required
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Prioritás</InputLabel>
          <Select
            value={priority}
            label="Prioritás"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="LOW">Alacsony</MenuItem>
            <MenuItem value="NORMAL">Normál</MenuItem>
            <MenuItem value="HIGH">Magas</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Megosztva</InputLabel>
          <Select
            value={list?.sharedWith?.map(user => user._id) || []}
            label="Megosztva"
            multiple
            renderValue={(selected) => selected.length > 0 
              ? selected.join(', ') 
              : 'Nincs megosztás'
            }
          >
            {list?.sharedWith?.length > 0 ? (
              list.sharedWith.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.username}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Nincs megosztott felhasználó</MenuItem>
            )}
          </Select>
        </FormControl>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '20px' }}
        >
          Mentés
        </Button>
      </form>

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
    </div>
  );
};

export default ListEditor; 