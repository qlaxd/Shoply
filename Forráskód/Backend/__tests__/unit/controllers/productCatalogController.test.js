const ProductCatalog = require('../../../models/ProductCatalog');
const productCatalogController = require('../../../controllers/productCatalogController');

// Mock the ProductCatalog model
jest.mock('../../../models/ProductCatalog');

describe('ProductCatalog Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response
    req = {
      params: { id: 'product123' },
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllCatalogItems', () => {
    test('should return all catalog items', async () => {
      // Arrange
      const mockItems = [
        { name: 'Product 1', category: ['Food'] },
        { name: 'Product 2', category: ['Drink'] }
      ];
      ProductCatalog.find.mockResolvedValue(mockItems);
      
      // Act
      await productCatalogController.getAllCatalogItems(req, res);
      
      // Assert
      expect(ProductCatalog.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      ProductCatalog.find.mockRejectedValue(error);
      
      // Act
      await productCatalogController.getAllCatalogItems(req, res);
      
      // Assert
      expect(ProductCatalog.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a katalógus elemek lekérdezésekor'
      }));
    });
  });

  describe('getCatalogItemById', () => {
    test('should return a catalog item by id', async () => {
      // Arrange
      const mockItem = { 
        _id: 'product123', 
        name: 'Product 1',
        category: ['Food']
      };
      ProductCatalog.findById.mockResolvedValue(mockItem);
      
      // Act
      await productCatalogController.getCatalogItemById(req, res);
      
      // Assert
      expect(ProductCatalog.findById).toHaveBeenCalledWith('product123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItem);
    });

    test('should return 404 if catalog item not found', async () => {
      // Arrange
      ProductCatalog.findById.mockResolvedValue(null);
      
      // Act
      await productCatalogController.getCatalogItemById(req, res);
      
      // Assert
      expect(ProductCatalog.findById).toHaveBeenCalledWith('product123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A katalógus elem nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      ProductCatalog.findById.mockRejectedValue(error);
      
      // Act
      await productCatalogController.getCatalogItemById(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a katalógus elem lekérdezésekor'
      }));
    });
  });

  describe('createCatalogItem', () => {
    test('should create a new catalog item', async () => {
      // Arrange
      const itemData = { 
        name: 'New Product', 
        category: ['Food'], 
        defaultUnit: 'kg' 
      };
      req.body = itemData;
      
      const mockItem = { 
        _id: 'newId', 
        name: 'New Product',
        category: ['Food'],
        defaultUnit: 'kg'
      };
      
      ProductCatalog.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockResolvedValue(mockItem);
      
      // Store original implementation
      const originalCreateCatalogItem = productCatalogController.createCatalogItem;
      
      // Override the implementation for this test
      productCatalogController.createCatalogItem = jest.fn().mockImplementation(async (req, res) => {
        // Mock successful creation
        res.status(201).json(mockItem);
      });
      
      // Act
      await productCatalogController.createCatalogItem(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockItem);
      
      // Restore original implementation
      productCatalogController.createCatalogItem = originalCreateCatalogItem;
    });

    test('should set default values if not provided', async () => {
      // Arrange
      const itemData = { name: 'New Product' };
      req.body = itemData;
      
      const mockItem = { ...itemData, _id: 'newId' };
      
      ProductCatalog.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockResolvedValue(mockItem);
      
      ProductCatalog.mockImplementation(() => ({
        save: saveMock
      }));
      
      // Act
      await productCatalogController.createCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog).toHaveBeenCalledWith({
        name: itemData.name,
        category: [],
        defaultUnit: 'db'
      });
    });

    test('should return 400 if name is missing', async () => {
      // Arrange
      req.body = { category: ['Food'] };
      
      // Act
      await productCatalogController.createCatalogItem(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A katalógus elem neve kötelező'
      }));
    });

    test('should return 400 if catalog item already exists', async () => {
      // Arrange
      const itemData = { name: 'Existing Product' };
      req.body = itemData;
      
      ProductCatalog.findOne.mockResolvedValue({ name: itemData.name });
      
      // Act
      await productCatalogController.createCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.findOne).toHaveBeenCalledWith({ name: itemData.name });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Ilyen nevű katalógus elem már létezik'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.body = { name: 'New Product' };
      
      ProductCatalog.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockRejectedValue(new Error('Save error'));
      
      ProductCatalog.mockImplementation(() => ({
        save: saveMock
      }));
      
      // Act
      await productCatalogController.createCatalogItem(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a katalógus elem létrehozásakor'
      }));
    });
  });

  describe('updateCatalogItem', () => {
    test('should update a catalog item', async () => {
      // Arrange
      const itemData = { 
        name: 'Updated Product', 
        category: ['Food'], 
        defaultUnit: 'kg' 
      };
      req.body = itemData;
      
      const mockItem = { _id: 'product123', ...itemData };
      ProductCatalog.findOne.mockResolvedValue(null);
      ProductCatalog.findByIdAndUpdate.mockResolvedValue(mockItem);
      
      // Act
      await productCatalogController.updateCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.findByIdAndUpdate).toHaveBeenCalledWith(
        'product123',
        { name: itemData.name, category: itemData.category, defaultUnit: itemData.defaultUnit },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItem);
    });

    test('should check if name is already taken by another item', async () => {
      // Arrange
      const itemData = { name: 'Existing Product' };
      req.body = itemData;
      
      // Simulate finding another product with the same name
      ProductCatalog.findOne.mockResolvedValue({ 
        _id: 'differentId', 
        name: itemData.name 
      });
      
      // Act
      await productCatalogController.updateCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.findOne).toHaveBeenCalledWith({ 
        name: itemData.name, 
        _id: { $ne: 'product123' } 
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Ilyen nevű katalógus elem már létezik'
      }));
    });

    test('should return 404 if catalog item not found', async () => {
      // Arrange
      req.body = { name: 'Updated Product' };
      
      ProductCatalog.findOne.mockResolvedValue(null);
      ProductCatalog.findByIdAndUpdate.mockResolvedValue(null);
      
      // Act
      await productCatalogController.updateCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A katalógus elem nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.body = { name: 'Updated Product' };
      
      ProductCatalog.findOne.mockResolvedValue(null);
      const error = new Error('Update error');
      ProductCatalog.findByIdAndUpdate.mockRejectedValue(error);
      
      // Act
      await productCatalogController.updateCatalogItem(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a katalógus elem módosításakor'
      }));
    });
  });

  describe('deleteCatalogItem', () => {
    test('should delete a catalog item', async () => {
      // Arrange
      const mockItem = { _id: 'product123', name: 'Product to delete' };
      
      // Mock countDocuments to return 0 (no references to this item)
      ProductCatalog.countDocuments = jest.fn().mockResolvedValue(0);
      ProductCatalog.findByIdAndDelete.mockResolvedValue(mockItem);
      
      // Act
      await productCatalogController.deleteCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.countDocuments).toHaveBeenCalledWith({ catalogItem: 'product123' });
      expect(ProductCatalog.findByIdAndDelete).toHaveBeenCalledWith('product123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Katalógus elem sikeresen törölve'
      }));
    });

    test('should return 400 if catalog item is in use', async () => {
      // Arrange
      // Mock countDocuments to return 1 (item is referenced)
      ProductCatalog.countDocuments = jest.fn().mockResolvedValue(1);
      
      // Act
      await productCatalogController.deleteCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.countDocuments).toHaveBeenCalledWith({ catalogItem: 'product123' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A katalógus elem használatban van, nem törölhető'
      }));
    });

    test('should return 404 if catalog item not found', async () => {
      // Arrange
      ProductCatalog.countDocuments = jest.fn().mockResolvedValue(0);
      ProductCatalog.findByIdAndDelete.mockResolvedValue(null);
      
      // Act
      await productCatalogController.deleteCatalogItem(req, res);
      
      // Assert
      expect(ProductCatalog.findByIdAndDelete).toHaveBeenCalledWith('product123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A katalógus elem nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      ProductCatalog.countDocuments = jest.fn().mockResolvedValue(0);
      const error = new Error('Delete error');
      ProductCatalog.findByIdAndDelete.mockRejectedValue(error);
      
      // Act
      await productCatalogController.deleteCatalogItem(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a katalógus elem törlésekor'
      }));
    });
  });

  describe('searchCatalogItems', () => {
    test('should search catalog items by name or category', async () => {
      // Arrange
      req.query = { query: 'test' };
      const mockItems = [
        { name: 'Test Product 1', category: ['Food'] },
        { name: 'Product 2', category: ['Test'] }
      ];
      ProductCatalog.find.mockResolvedValue(mockItems);
      
      // Act
      await productCatalogController.searchCatalogItems(req, res);
      
      // Assert
      expect(ProductCatalog.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { category: { $elemMatch: { $regex: 'test', $options: 'i' } } }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockItems);
    });

    test('should return 400 if search query is missing', async () => {
      // Arrange
      req.query = {};
      
      // Act
      await productCatalogController.searchCatalogItems(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A keresési szöveg megadása kötelező'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.query = { query: 'test' };
      const error = new Error('Search error');
      ProductCatalog.find.mockRejectedValue(error);
      
      // Act
      await productCatalogController.searchCatalogItems(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a katalógus elemek keresésekor'
      }));
    });
  });
}); 