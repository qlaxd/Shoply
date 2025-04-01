const mongoose = require('mongoose');
const List = require('../../../models/List');
const User = require('../../../models/User');
const ProductCatalog = require('../../../models/ProductCatalog');

describe('List Model Test', () => {
  // Test list validation with valid data
  test('should validate a list with all required fields', async () => {
    // Create a test user first
    const user = new User({
      username: 'listuser',
      email: 'list@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    
    const validList = {
      title: 'My Shopping List',
      owner: savedUser._id
    };
    
    const list = new List(validList);
    const savedList = await list.save();
    
    // Verify saved list
    expect(savedList._id).toBeDefined();
    expect(savedList.title).toBe(validList.title);
    expect(savedList.owner.toString()).toBe(savedUser._id.toString());
    expect(savedList.products).toEqual([]);
    expect(savedList.sharedUsers).toEqual([]);
    expect(savedList.priority).toBe(0); // Default value
    expect(savedList.version).toBe(1); // Default value
    expect(savedList.status).toBe('active'); // Default value
    expect(savedList.deleted).toBe(false); // Default value
    expect(savedList.createdAt).toBeDefined();
    expect(savedList.updatedAt).toBeDefined();
  });
  
  // Test validation for missing required fields
  test('should fail validation when required fields are missing', async () => {
    // Missing owner
    const listWithoutOwner = new List({
      title: 'List Without Owner'
    });
    
    // Expect validation error to be thrown
    await expect(listWithoutOwner.save()).rejects.toThrow();
    
    // Create a test user
    const user = new User({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    
    // Missing title
    const listWithoutTitle = new List({
      owner: savedUser._id
    });
    
    // Expect validation error to be thrown
    await expect(listWithoutTitle.save()).rejects.toThrow();
  });
  
  // Test list with products
  test('should create a list with products', async () => {
    // Create a test user
    const user = new User({
      username: 'productsuser',
      email: 'products@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    
    // Create a product catalog item
    const product = new ProductCatalog({
      name: 'Test Catalog Item'
    });
    const savedProduct = await product.save();
    
    // Create a list with products
    const list = new List({
      title: 'List with Products',
      owner: savedUser._id,
      products: [
        {
          catalogItem: savedProduct._id,
          quantity: 2,
          isPurchased: false,
          addedBy: savedUser._id
        },
        {
          name: 'Custom Item', // non-catalog item
          quantity: 1,
          unit: 'pcs',
          isPurchased: true,
          addedBy: savedUser._id,
          notes: 'Get the fresh ones'
        }
      ]
    });
    
    const savedList = await list.save();
    
    // Verify saved list
    expect(savedList.products).toHaveLength(2);
    expect(savedList.products[0].catalogItem.toString()).toBe(savedProduct._id.toString());
    expect(savedList.products[0].quantity).toBe(2);
    expect(savedList.products[0].isPurchased).toBe(false);
    
    expect(savedList.products[1].name).toBe('Custom Item');
    expect(savedList.products[1].catalogItem).toBeUndefined();
    expect(savedList.products[1].quantity).toBe(1);
    expect(savedList.products[1].unit).toBe('pcs');
    expect(savedList.products[1].isPurchased).toBe(true);
    expect(savedList.products[1].notes).toBe('Get the fresh ones');
  });
  
  // Test list with shared users
  test('should create a list shared with other users', async () => {
    // Create owner user
    const owner = new User({
      username: 'listowner',
      email: 'owner@example.com',
      password: 'password123'
    });
    const savedOwner = await owner.save();
    
    // Create shared user
    const sharedUser = new User({
      username: 'shareduser',
      email: 'shared@example.com',
      password: 'password123'
    });
    const savedSharedUser = await sharedUser.save();
    
    // Create list with shared user
    const list = new List({
      title: 'Shared List',
      owner: savedOwner._id,
      sharedUsers: [
        {
          user: savedSharedUser._id,
          permissionLevel: 'edit'
        }
      ]
    });
    
    const savedList = await list.save();
    
    // Verify shared user
    expect(savedList.sharedUsers).toHaveLength(1);
    expect(savedList.sharedUsers[0].user.toString()).toBe(savedSharedUser._id.toString());
    expect(savedList.sharedUsers[0].permissionLevel).toBe('edit');
  });
  
  // Test list status
  test('should create a list with different statuses', async () => {
    // Create a test user
    const user = new User({
      username: 'statususer',
      email: 'status@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    
    // Create completed list
    const completedList = new List({
      title: 'Completed List',
      owner: savedUser._id,
      status: 'completed'
    });
    
    const savedCompletedList = await completedList.save();
    expect(savedCompletedList.status).toBe('completed');
    
    // Create archived list
    const archivedList = new List({
      title: 'Archived List',
      owner: savedUser._id,
      status: 'archived'
    });
    
    const savedArchivedList = await archivedList.save();
    expect(savedArchivedList.status).toBe('archived');
  });
  
  // Test update list
  test('should update a list', async () => {
    // Create a test user
    const user = new User({
      username: 'updateuser',
      email: 'update@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    
    // Create a list
    const list = new List({
      title: 'Original Title',
      owner: savedUser._id,
      priority: 0
    });
    
    const savedList = await list.save();
    
    // Update the list
    savedList.title = 'Updated Title';
    savedList.priority = 1;
    savedList.version = 2;
    savedList.status = 'completed';
    
    const updatedList = await savedList.save();
    
    // Verify updates
    expect(updatedList.title).toBe('Updated Title');
    expect(updatedList.priority).toBe(1);
    expect(updatedList.version).toBe(2);
    expect(updatedList.status).toBe('completed');
  });
  
  // Test adding products to a list
  test('should add products to an existing list', async () => {
    // Create a test user
    const user = new User({
      username: 'addproductuser',
      email: 'addproduct@example.com',
      password: 'password123'
    });
    const savedUser = await user.save();
    
    // Create an empty list
    const list = new List({
      title: 'Empty List',
      owner: savedUser._id
    });
    
    const savedList = await list.save();
    expect(savedList.products).toHaveLength(0);
    
    // Add a product to the list
    savedList.products.push({
      name: 'Added Product',
      quantity: 3,
      addedBy: savedUser._id
    });
    
    const updatedList = await savedList.save();
    
    // Verify product was added
    expect(updatedList.products).toHaveLength(1);
    expect(updatedList.products[0].name).toBe('Added Product');
    expect(updatedList.products[0].quantity).toBe(3);
    expect(updatedList.products[0].addedBy.toString()).toBe(savedUser._id.toString());
  });
}); 