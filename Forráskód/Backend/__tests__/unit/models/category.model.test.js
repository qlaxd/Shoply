const mongoose = require('mongoose');
const Category = require('../../../models/Category');

describe('Category Model Test', () => {
  // Test category validation with valid data
  test('should validate a category with all required fields', async () => {
    const validCategory = {
      name: 'Grocery'
    };
    
    const category = new Category(validCategory);
    const savedCategory = await category.save();
    
    // Verify saved category
    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe(validCategory.name);
    expect(savedCategory.level).toBe(0); // Default value
    expect(savedCategory.isActive).toBe(true); // Default value
    expect(savedCategory.parentCategory).toBeNull(); // Default value
    expect(savedCategory.createdAt).toBeDefined();
    expect(savedCategory.updatedAt).toBeDefined();
  });
  
  // Test validation for missing required fields
  test('should fail validation when required fields are missing', async () => {
    const categoryWithoutRequiredField = new Category({
      // Missing name field
      description: 'This is a category without name'
    });
    
    // Expect validation error to be thrown
    await expect(categoryWithoutRequiredField.save()).rejects.toThrow();
  });
  
  // Test name uniqueness
  test('should fail when name is not unique', async () => {
    // Create first category
    const firstCategory = new Category({
      name: 'Unique Category'
    });
    await firstCategory.save();
    
    // Try to create another category with the same name
    const secondCategory = new Category({
      name: 'Unique Category' // Same name
    });
    
    // Expect a duplicate key error to be thrown
    await expect(secondCategory.save()).rejects.toThrow();
  });
  
  // Test category with parent category
  test('should create a category with parent category reference', async () => {
    // Create parent category
    const parentCategory = new Category({
      name: 'Parent Category',
      level: 0
    });
    const savedParent = await parentCategory.save();
    
    // Create child category
    const childCategory = new Category({
      name: 'Child Category',
      parentCategory: savedParent._id,
      level: 1
    });
    const savedChild = await childCategory.save();
    
    // Verify saved child category
    expect(savedChild.parentCategory).toEqual(savedParent._id);
    expect(savedChild.level).toBe(1);
  });
  
  // Test setting isActive to false
  test('should create an inactive category', async () => {
    const inactiveCategory = new Category({
      name: 'Inactive Category',
      isActive: false
    });
    
    const savedCategory = await inactiveCategory.save();
    
    // Verify it's saved as inactive
    expect(savedCategory.isActive).toBe(false);
  });
  
  // Test update category
  test('should update a category', async () => {
    // Create a category
    const category = new Category({
      name: 'Original Name',
      description: 'Original description'
    });
    const savedCategory = await category.save();
    
    // Update the category
    savedCategory.name = 'Updated Name';
    savedCategory.description = 'Updated description';
    const updatedCategory = await savedCategory.save();
    
    // Verify updates
    expect(updatedCategory.name).toBe('Updated Name');
    expect(updatedCategory.description).toBe('Updated description');
  });
}); 