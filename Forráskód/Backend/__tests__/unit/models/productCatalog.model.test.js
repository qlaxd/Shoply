const mongoose = require('mongoose');
const ProductCatalog = require('../../../models/ProductCatalog');
const Category = require('../../../models/Category');

describe('ProductCatalog Model Test', () => {
  // Test product catalog validation with valid data
  test('should validate a product catalog item with all required fields', async () => {
    const validProduct = {
      name: 'Test Product'
    };
    
    const product = new ProductCatalog(validProduct);
    const savedProduct = await product.save();
    
    // Verify saved product
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(validProduct.name);
    expect(savedProduct.usageCount).toBe(0); // Default value
    expect(savedProduct.lastUsed).toBeDefined(); // Default value
    expect(savedProduct.createdAt).toBeDefined();
    expect(savedProduct.updatedAt).toBeDefined();
  });
  
  // Test validation for missing required fields
  test('should fail validation when required fields are missing', async () => {
    const productWithoutRequiredField = new ProductCatalog({
      // Missing name field
      defaultUnit: 'kg'
    });
    
    // Expect validation error to be thrown
    await expect(productWithoutRequiredField.save()).rejects.toThrow();
  });
  
  // Test name uniqueness
  test('should fail when name is not unique', async () => {
    // Create first product
    const firstProduct = new ProductCatalog({
      name: 'Unique Product'
    });
    await firstProduct.save();
    
    // Try to create another product with the same name
    const secondProduct = new ProductCatalog({
      name: 'Unique Product' // Same name
    });
    
    // Expect a duplicate key error to be thrown
    await expect(secondProduct.save()).rejects.toThrow();
  });
  
  // Test barcode uniqueness
  test('should fail when barcode is not unique', async () => {
    // Create first product with barcode
    const firstProduct = new ProductCatalog({
      name: 'Product One',
      barcode: '1234567890123'
    });
    await firstProduct.save();
    
    // Try to create another product with the same barcode
    const secondProduct = new ProductCatalog({
      name: 'Product Two',
      barcode: '1234567890123' // Same barcode
    });
    
    // Expect a duplicate key error to be thrown
    await expect(secondProduct.save()).rejects.toThrow();
  });
  
  // Test product with category
  test('should create a product with category reference', async () => {
    // Create a category first
    const category = new Category({
      name: 'Test Category'
    });
    const savedCategory = await category.save();
    
    // Create product with category reference
    const product = new ProductCatalog({
      name: 'Categorized Product',
      category: savedCategory._id
    });
    const savedProduct = await product.save();
    
    // Verify saved product
    expect(savedProduct.category).toEqual(savedCategory._id);
  });
  
  // Test product with all fields
  test('should create a product with all fields', async () => {
    // Generate a random user ID
    const userId = new mongoose.Types.ObjectId();
    
    const completeProduct = {
      name: 'Complete Product',
      defaultUnit: 'l',
      barcode: '9876543210987',
      createdBy: userId,
      usageCount: 5
    };
    
    const product = new ProductCatalog(completeProduct);
    const savedProduct = await product.save();
    
    // Verify all fields
    expect(savedProduct.name).toBe(completeProduct.name);
    expect(savedProduct.defaultUnit).toBe(completeProduct.defaultUnit);
    expect(savedProduct.barcode).toBe(completeProduct.barcode);
    expect(savedProduct.createdBy).toEqual(completeProduct.createdBy);
    expect(savedProduct.usageCount).toBe(completeProduct.usageCount);
  });
  
  // Test updating product
  test('should update a product', async () => {
    // Create a product
    const product = new ProductCatalog({
      name: 'Original Product',
      defaultUnit: 'kg'
    });
    const savedProduct = await product.save();
    
    // Update the product
    savedProduct.name = 'Updated Product';
    savedProduct.defaultUnit = 'g';
    savedProduct.usageCount = 10;
    
    const updatedProduct = await savedProduct.save();
    
    // Verify updates
    expect(updatedProduct.name).toBe('Updated Product');
    expect(updatedProduct.defaultUnit).toBe('g');
    expect(updatedProduct.usageCount).toBe(10);
  });
  
  // Test null barcode is allowed
  test('should allow null barcode', async () => {
    // Create products with undefined and null barcodes
    const product1 = new ProductCatalog({
      name: 'No Barcode Product 1'
      // barcode is undefined
    });
    
    const product2 = new ProductCatalog({
      name: 'No Barcode Product 2',
      barcode: null
    });
    
    // Save both products
    const saved1 = await product1.save();
    const saved2 = await product2.save();
    
    // Verify they were saved correctly
    expect(saved1._id).toBeDefined();
    expect(saved2._id).toBeDefined();
  });
}); 