const Category = require('../../../models/Category');
const categoryController = require('../../../controllers/categoryController');

// Mock the Category model
jest.mock('../../../models/Category');

describe('Category Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response
    req = {
      params: { id: 'category123' },
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllCategories', () => {
    test('should return all categories', async () => {
      // Arrange
      const mockCategories = [{ name: 'Category 1' }, { name: 'Category 2' }];
      Category.find.mockResolvedValue(mockCategories);
      
      // Act
      await categoryController.getAllCategories(req, res);
      
      // Assert
      expect(Category.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Category.find.mockRejectedValue(error);
      
      // Act
      await categoryController.getAllCategories(req, res);
      
      // Assert
      expect(Category.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a kategóriák lekérdezésekor'
      }));
    });
  });

  describe('getCategoryById', () => {
    test('should return a category by id', async () => {
      // Arrange
      const mockCategory = { _id: 'category123', name: 'Category 1' };
      Category.findById.mockResolvedValue(mockCategory);
      
      // Act
      await categoryController.getCategoryById(req, res);
      
      // Assert
      expect(Category.findById).toHaveBeenCalledWith('category123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    test('should return 404 if category not found', async () => {
      // Arrange
      Category.findById.mockResolvedValue(null);
      
      // Act
      await categoryController.getCategoryById(req, res);
      
      // Assert
      expect(Category.findById).toHaveBeenCalledWith('category123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A kategória nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Category.findById.mockRejectedValue(error);
      
      // Act
      await categoryController.getCategoryById(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a kategória lekérdezésekor'
      }));
    });
  });

  describe('createCategory', () => {
    test('should create a new category', async () => {
      // Arrange
      const categoryData = { name: 'New Category' };
      req.body = categoryData;
      
      const mockCategory = { ...categoryData, _id: 'newId' };
      const saveMock = jest.fn().mockResolvedValue(mockCategory);
      
      Category.findOne.mockResolvedValue(null);
      Category.mockImplementation(() => mockCategory);
      mockCategory.save = saveMock;
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(Category.findOne).toHaveBeenCalledWith({ name: categoryData.name });
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    test('should return 400 if category already exists', async () => {
      // Arrange
      const categoryData = { name: 'Existing Category' };
      req.body = categoryData;
      
      Category.findOne.mockResolvedValue({ name: categoryData.name });
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(Category.findOne).toHaveBeenCalledWith({ name: categoryData.name });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A megadott kategória már létezik'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.body = { name: 'New Category' };
      
      Category.findOne.mockResolvedValue(null);
      const saveMock = jest.fn().mockRejectedValue(new Error('Save error'));
      
      Category.mockImplementation(() => ({
        save: saveMock
      }));
      
      // Act
      await categoryController.createCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a kategória létrehozása során'
      }));
    });
  });

  describe('updateCategory', () => {
    test('should update a category', async () => {
      // Arrange
      const categoryData = { name: 'Updated Category' };
      req.body = categoryData;
      
      const mockCategory = { _id: 'category123', ...categoryData };
      Category.findByIdAndUpdate.mockResolvedValue(mockCategory);
      
      // Act
      await categoryController.updateCategory(req, res);
      
      // Assert
      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        'category123',
        categoryData,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategory);
    });

    test('should return 404 if category not found', async () => {
      // Arrange
      req.body = { name: 'Updated Category' };
      Category.findByIdAndUpdate.mockResolvedValue(null);
      
      // Act
      await categoryController.updateCategory(req, res);
      
      // Assert
      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
        'category123',
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A kategória nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      req.body = { name: 'Updated Category' };
      const error = new Error('Update error');
      Category.findByIdAndUpdate.mockRejectedValue(error);
      
      // Act
      await categoryController.updateCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a kategória frissítésekor'
      }));
    });
  });

  describe('deleteCategory', () => {
    test('should delete a category', async () => {
      // Arrange
      const mockCategory = { _id: 'category123', name: 'Category to delete' };
      Category.findByIdAndDelete.mockResolvedValue(mockCategory);
      
      // Act
      await categoryController.deleteCategory(req, res);
      
      // Assert
      expect(Category.findByIdAndDelete).toHaveBeenCalledWith('category123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalled();
    });

    test('should return 404 if category not found', async () => {
      // Arrange
      Category.findByIdAndDelete.mockResolvedValue(null);
      
      // Act
      await categoryController.deleteCategory(req, res);
      
      // Assert
      expect(Category.findByIdAndDelete).toHaveBeenCalledWith('category123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'A kategória nem található'
      }));
    });

    test('should handle errors', async () => {
      // Arrange
      const error = new Error('Delete error');
      Category.findByIdAndDelete.mockRejectedValue(error);
      
      // Act
      await categoryController.deleteCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a kategória törlésekor'
      }));
    });
  });

  describe('searchCategory', () => {
    test('should search categories by name', async () => {
      // Arrange
      req.query = { search: 'test' };
      const mockCategories = [
        { name: 'Test Category 1' },
        { name: 'Test Category 2' }
      ];
      Category.find.mockResolvedValue(mockCategories);
      
      // Act
      await categoryController.searchCategory(req, res);
      
      // Assert
      expect(Category.find).toHaveBeenCalledWith({
        name: { $regex: 'test', $options: 'i' }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    test('should handle errors', async () => {
      // Arrange
      req.query = { search: 'test' };
      const error = new Error('Search error');
      Category.find.mockRejectedValue(error);
      
      // Act
      await categoryController.searchCategory(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Hiba a kategóriák keresésekor'
      }));
    });
  });
}); 