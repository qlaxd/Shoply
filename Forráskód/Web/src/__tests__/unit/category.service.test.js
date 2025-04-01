import api from '../../services/api';
import CategoryService from '../../services/category.service';

// Mock the api module
jest.mock('../../services/api');

describe('CategoryService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should fetch all categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' }
      ];
      api.get.mockResolvedValueOnce({ data: mockCategories });

      const result = await CategoryService.getAllCategories();
      
      expect(api.get).toHaveBeenCalledWith('/categories');
      expect(result).toEqual(mockCategories);
    });

    it('should handle error when fetching categories fails', async () => {
      const errorMessage = 'Network error';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(CategoryService.getAllCategories()).rejects.toThrow(errorMessage);
      expect(api.get).toHaveBeenCalledWith('/categories');
    });
  });

  describe('getCategoryById', () => {
    it('should fetch a specific category successfully', async () => {
      const mockCategory = { id: 1, name: 'Category 1' };
      api.get.mockResolvedValueOnce({ data: mockCategory });

      const result = await CategoryService.getCategoryById(1);
      
      expect(api.get).toHaveBeenCalledWith('/categories/1');
      expect(result).toEqual(mockCategory);
    });

    it('should handle error when fetching specific category fails', async () => {
      const errorMessage = 'Category not found';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(CategoryService.getCategoryById(1)).rejects.toThrow(errorMessage);
      expect(api.get).toHaveBeenCalledWith('/categories/1');
    });
  });

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      const newCategory = { name: 'New Category' };
      const mockResponse = { id: 1, ...newCategory };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await CategoryService.createCategory(newCategory);
      
      expect(api.post).toHaveBeenCalledWith('/categories', newCategory);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when creating category fails', async () => {
      const errorMessage = 'Invalid data';
      api.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(CategoryService.createCategory({})).rejects.toThrow(errorMessage);
      expect(api.post).toHaveBeenCalledWith('/categories', {});
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const categoryId = 1;
      const updateData = { name: 'Updated Category' };
      const mockResponse = { id: categoryId, ...updateData };
      api.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await CategoryService.updateCategory(categoryId, updateData);
      
      expect(api.put).toHaveBeenCalledWith(`/categories/${categoryId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when updating category fails', async () => {
      const errorMessage = 'Update failed';
      api.put.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(CategoryService.updateCategory(1, {})).rejects.toThrow(errorMessage);
      expect(api.put).toHaveBeenCalledWith('/categories/1', {});
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      api.delete.mockResolvedValueOnce({});

      const result = await CategoryService.deleteCategory(1);
      
      expect(api.delete).toHaveBeenCalledWith('/categories/1');
      expect(result).toBe(true);
    });

    it('should handle error when deleting category fails', async () => {
      const errorMessage = 'Delete failed';
      api.delete.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(CategoryService.deleteCategory(1)).rejects.toThrow(errorMessage);
      expect(api.delete).toHaveBeenCalledWith('/categories/1');
    });
  });

  describe('searchCategories', () => {
    it('should search categories successfully', async () => {
      const searchTerm = 'food';
      const mockCategories = [
        { id: 1, name: 'Food Category 1' },
        { id: 2, name: 'Food Category 2' }
      ];
      api.get.mockResolvedValueOnce({ data: mockCategories });

      const result = await CategoryService.searchCategories(searchTerm);
      
      expect(api.get).toHaveBeenCalledWith(`/categories/search?search=${encodeURIComponent(searchTerm)}`);
      expect(result).toEqual(mockCategories);
    });

    it('should handle error when searching categories fails', async () => {
      const errorMessage = 'Search failed';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(CategoryService.searchCategories('query')).rejects.toThrow(errorMessage);
      expect(api.get).toHaveBeenCalledWith('/categories/search?search=query');
    });

    it('should properly encode search terms with special characters', async () => {
      const searchTerm = 'food & drinks';
      const mockCategories = [{ id: 1, name: 'Food & Drinks' }];
      api.get.mockResolvedValueOnce({ data: mockCategories });

      await CategoryService.searchCategories(searchTerm);
      
      expect(api.get).toHaveBeenCalledWith(`/categories/search?search=${encodeURIComponent(searchTerm)}`);
    });
  });
}); 