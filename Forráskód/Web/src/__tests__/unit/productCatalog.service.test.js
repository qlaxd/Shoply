import api from '../../services/api';
import ProductCatalogService from '../../services/productCatalog.service';

// Mock the api module
jest.mock('../../services/api');

describe('ProductCatalogService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllCatalogItems', () => {
    it('should fetch all catalog items successfully', async () => {
      const mockItems = [
        { id: 1, name: 'Product 1', category: 'Category 1' },
        { id: 2, name: 'Product 2', category: 'Category 2' }
      ];
      api.get.mockResolvedValueOnce({ data: mockItems });

      const result = await ProductCatalogService.getAllCatalogItems();
      
      expect(api.get).toHaveBeenCalledWith('/productCatalogs');
      expect(result).toEqual(mockItems);
    });

    it('should handle error when fetching catalog items fails', async () => {
      const errorMessage = 'Network error';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ProductCatalogService.getAllCatalogItems()).rejects.toThrow(errorMessage);
      expect(api.get).toHaveBeenCalledWith('/productCatalogs');
    });
  });

  describe('searchCatalogItems', () => {
    it('should search catalog items successfully', async () => {
      const query = 'milk';
      const mockItems = [
        { id: 1, name: 'Milk 1L', category: 'Dairy' },
        { id: 2, name: 'Milk 2L', category: 'Dairy' }
      ];
      api.get.mockResolvedValueOnce({ data: mockItems });

      const result = await ProductCatalogService.searchCatalogItems(query);
      
      expect(api.get).toHaveBeenCalledWith('/productCatalogs/search', {
        params: { query }
      });
      expect(result).toEqual(mockItems);
    });

    it('should handle error when searching catalog items fails', async () => {
      const errorMessage = 'Search failed';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ProductCatalogService.searchCatalogItems('query')).rejects.toThrow(errorMessage);
    });
  });

  describe('getCatalogItemById', () => {
    it('should fetch a specific catalog item successfully', async () => {
      const mockItem = { id: 1, name: 'Product 1', category: 'Category 1' };
      api.get.mockResolvedValueOnce({ data: mockItem });

      const result = await ProductCatalogService.getCatalogItemById(1);
      
      expect(api.get).toHaveBeenCalledWith('/productCatalogs/1');
      expect(result).toEqual(mockItem);
    });

    it('should handle error when fetching specific catalog item fails', async () => {
      const errorMessage = 'Item not found';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ProductCatalogService.getCatalogItemById(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('createCatalogItem', () => {
    it('should create a new catalog item successfully', async () => {
      const newItem = { name: 'New Product', category: 'New Category' };
      const mockResponse = { id: 1, ...newItem };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await ProductCatalogService.createCatalogItem(newItem);
      
      expect(api.post).toHaveBeenCalledWith('/productCatalogs', newItem);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when creating catalog item fails', async () => {
      const errorMessage = 'Invalid data';
      api.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ProductCatalogService.createCatalogItem({})).rejects.toThrow(errorMessage);
    });
  });

  describe('updateCatalogItem', () => {
    it('should update a catalog item successfully', async () => {
      const itemId = 1;
      const updateData = { name: 'Updated Product' };
      const mockResponse = { id: itemId, ...updateData };
      api.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await ProductCatalogService.updateCatalogItem(itemId, updateData);
      
      expect(api.put).toHaveBeenCalledWith(`/productCatalogs/${itemId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when updating catalog item fails', async () => {
      const errorMessage = 'Update failed';
      api.put.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ProductCatalogService.updateCatalogItem(1, {})).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteCatalogItem', () => {
    it('should delete a catalog item successfully', async () => {
      const itemId = 1;
      const mockResponse = { success: true };
      api.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await ProductCatalogService.deleteCatalogItem(itemId);
      
      expect(api.delete).toHaveBeenCalledWith(`/productCatalogs/${itemId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when deleting catalog item fails', async () => {
      const errorMessage = 'Delete failed';
      api.delete.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ProductCatalogService.deleteCatalogItem(1)).rejects.toThrow(errorMessage);
    });
  });
}); 