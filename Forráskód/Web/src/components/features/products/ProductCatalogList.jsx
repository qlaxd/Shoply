import React, { useState, useEffect } from 'react';
import ProductCatalogService from '../../../services/productCatalog.service';
import { Alert, CircularProgress, List, ListItem, ListItemText, Typography, Button } from '@mui/material';

const ProductCatalogList = () => {
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogItems = async () => {
      try {
        const data = await ProductCatalogService.getAllCatalogItems();
        setCatalogItems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCatalogItems();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Termékkatalógus
      </Typography>
      
      <List>
        {catalogItems.map((item) => (
          <ListItem key={item._id} divider>
            <ListItemText
              primary={item.name}
              secondary={`Kategória: ${item.categoryHierarchy.join(' > ')} | Alapértelmezett egység: ${item.defaultUnit}`}
            />
          </ListItem>
        ))}
      </List>
      
      {catalogItems.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center">
          Nincsenek katalógus elemek
        </Typography>
      )}
    </div>
  );
};

export default ProductCatalogList;