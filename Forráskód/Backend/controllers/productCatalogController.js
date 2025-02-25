const mongoose = require('mongoose');
const ProductCatalog = require('../models/ProductCatalog');

// Összes katalógus elem lekérdezése
exports.getAllCatalogItems = async (req, res) => {
  try {
    const catalogItems = await ProductCatalog.find({});
    res.status(200).json(catalogItems);
  } catch (error) {
    console.error('Hiba a katalógus elemek lekérdezésekor:', error);
    res.status(500).json({ message: 'Hiba a katalógus elemek lekérdezésekor', error });
  }
};

// Katalógus elem lekérdezése ID alapján
exports.getCatalogItemById = async (req, res) => {
  try {
    const catalogItem = await ProductCatalog.findById(req.params.id);
    
    if (!catalogItem) {
      return res.status(404).json({ message: 'A katalógus elem nem található' });
    }
    
    res.status(200).json(catalogItem);
  } catch (error) {
    console.error('Hiba a katalógus elem lekérdezésekor:', error);
    res.status(500).json({ message: 'Hiba a katalógus elem lekérdezésekor', error });
  }
};

// Új katalógus elem létrehozása
exports.createCatalogItem = async (req, res) => {
  try {
    const { name, categoryHierarchy, defaultUnit } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'A katalógus elem neve kötelező' });
    }
    
    const existingItem = await ProductCatalog.findOne({ name });
    if (existingItem) {
      return res.status(400).json({ message: 'Ilyen nevű katalógus elem már létezik' });
    }
    
    const catalogItem = new ProductCatalog({
      name,
      categoryHierarchy: categoryHierarchy || [],
      defaultUnit: defaultUnit || 'db'
    });
    
    await catalogItem.save();
    res.status(201).json(catalogItem);
  } catch (error) {
    console.error('Hiba a katalógus elem létrehozásakor:', error);
    res.status(500).json({ message: 'Hiba a katalógus elem létrehozásakor', error });
  }
};

// Katalógus elem módosítása
exports.updateCatalogItem = async (req, res) => {
  try {
    const { name, categoryHierarchy, defaultUnit } = req.body;
    
    // Ha a nevet módosítják, ellenőrizzük, hogy nem foglalt-e
    if (name) {
      const existingItem = await ProductCatalog.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingItem) {
        return res.status(400).json({ message: 'Ilyen nevű katalógus elem már létezik' });
      }
    }
    
    const catalogItem = await ProductCatalog.findByIdAndUpdate(
      req.params.id,
      { name, categoryHierarchy, defaultUnit },
      { new: true }
    );
    
    if (!catalogItem) {
      return res.status(404).json({ message: 'A katalógus elem nem található' });
    }
    
    res.status(200).json(catalogItem);
  } catch (error) {
    console.error('Hiba a katalógus elem módosításakor:', error);
    res.status(500).json({ message: 'Hiba a katalógus elem módosításakor', error });
  }
};

// Katalógus elem törlése
exports.deleteCatalogItem = async (req, res) => {
  try {
    // Ellenőrizzük, hogy használatban van-e a katalógus elem
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({ catalogItem: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'A katalógus elem használatban van, nem törölhető',
        affectedProducts: productCount
      });
    }
    
    const catalogItem = await ProductCatalog.findByIdAndDelete(req.params.id);
    
    if (!catalogItem) {
      return res.status(404).json({ message: 'A katalógus elem nem található' });
    }
    
    res.status(200).json({ message: 'Katalógus elem sikeresen törölve' });
  } catch (error) {
    console.error('Hiba a katalógus elem törlésekor:', error);
    res.status(500).json({ message: 'Hiba a katalógus elem törlésekor', error });
  }
};

// Katalógus elemek keresése
exports.searchCatalogItems = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'A keresési szöveg megadása kötelező' });
    }
    
    const catalogItems = await ProductCatalog.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'categoryHierarchy': { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json(catalogItems);
  } catch (error) {
    console.error('Hiba a katalógus elemek keresésekor:', error);
    res.status(500).json({ message: 'Hiba a katalógus elemek keresésekor', error });
  }
}; 