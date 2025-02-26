const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductCatalog = require('../models/ProductCatalog');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate({
      path: 'catalogItem',
      model: 'ProductCatalog'
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Hiba a termékek lekérdezésekor:', error);
    res.status(500).json({ message: 'Hiba a termékek lekérdezésekor', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'catalogItem',
      model: 'ProductCatalog'
    });
    
    if (!product) {
      return res.status(404).json({ message: 'A termék nem található' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Hiba a termék lekérdezésekor:', error);
    res.status(500).json({ message: 'Hiba a termék lekérdezésekor', error });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Ha katalógus alapú termék, ellenőrizzük a katalóguselem létezését
    if (productData.catalogItem) {
      const catalogItem = await ProductCatalog.findById(productData.catalogItem);
      if (!catalogItem) {
        return res.status(400).json({ message: 'A megadott katalóguselem nem létezik' });
      }
    } else if (!productData.name) {
      // Ha nem katalógus alapú, akkor kötelező a név
      return res.status(400).json({ message: 'A termék neve kötelező katalógus nélküli termékeknél' });
    }
    
    const product = new Product(productData);
    await product.save();
    
    // Visszaadjuk a populált terméket
    const populatedProduct = await Product.findById(product._id).populate({
      path: 'catalogItem',
      model: 'ProductCatalog'
    });
    
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error('Hiba a termék létrehozásakor:', error);
    res.status(500).json({ message: 'Hiba a termék létrehozásakor', error });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Ha katalógus alapú termék, ellenőrizzük a katalóguselem létezését
    if (productData.catalogItem) {
      const catalogItem = await ProductCatalog.findById(productData.catalogItem);
      if (!catalogItem) {
        return res.status(400).json({ message: 'A megadott katalóguselem nem létezik' });
      }
    } else if (!productData.name) {
      // Ha nem katalógus alapú, akkor kötelező a név
      return res.status(400).json({ message: 'A termék neve kötelező katalógus nélküli termékeknél' });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      productData, 
      { new: true }
    ).populate({
      path: 'catalogItem',
      model: 'ProductCatalog'
    });
    
    if (!product) {
      return res.status(404).json({ message: 'A termék nem található' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Hiba a termék módosításakor:', error);
    res.status(500).json({ message: 'Hiba a termék módosításakor', error });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'A termék nem található' });
    }
    
    res.status(200).json({ message: 'Termék sikeresen törölve' });
  } catch (error) {
    console.error('Hiba a termék törlésekor:', error);
    res.status(500).json({ message: 'Hiba a termék törlésekor', error });
  }
};

// Termékek keresése név vagy kategória alapján
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'A keresési szöveg megadása kötelező' });
    }
    
    // Keresés katalógus alapú termékek között
    const catalogItems = await ProductCatalog.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'category': { $regex: query, $options: 'i' } }
      ]
    });
    
    const catalogItemIds = catalogItems.map(item => item._id);
    
    // Termékek keresése
    const products = await Product.find({
      $or: [
        { catalogItem: { $in: catalogItemIds } },
        { name: { $regex: query, $options: 'i' } }
      ]
    }).populate({
      path: 'catalogItem',
      model: 'ProductCatalog'
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Hiba a termékek keresésekor:', error);
    res.status(500).json({ message: 'Hiba a termékek keresésekor', error });
  }
};