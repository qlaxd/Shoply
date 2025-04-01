import api from '../../services/api';
import ListService from '../../services/list.service';

// Mock the api module
jest.mock('../../services/api');

describe('ListService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getUserLists', () => {
    it('should fetch user lists successfully', async () => {
      const mockLists = [
        { id: 1, name: 'Shopping List 1' },
        { id: 2, name: 'Shopping List 2' }
      ];
      api.get.mockResolvedValueOnce({ data: mockLists });

      const result = await ListService.getUserLists();
      
      expect(api.get).toHaveBeenCalledWith('/lists');
      expect(result).toEqual(mockLists);
    });

    it('should handle error when fetching lists fails', async () => {
      const errorMessage = 'Network error';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.getUserLists()).rejects.toThrow(errorMessage);
      expect(api.get).toHaveBeenCalledWith('/lists');
    });
  });

  describe('getListById', () => {
    it('should fetch a specific list by id', async () => {
      const mockList = { id: 1, name: 'Shopping List 1' };
      api.get.mockResolvedValueOnce({ data: mockList });

      const result = await ListService.getListById(1);
      
      expect(api.get).toHaveBeenCalledWith('/lists/1');
      expect(result).toEqual(mockList);
    });

    it('should handle error when fetching specific list fails', async () => {
      const errorMessage = 'List not found';
      api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.getListById(1)).rejects.toThrow(errorMessage);
      expect(api.get).toHaveBeenCalledWith('/lists/1');
    });
  });

  describe('createList', () => {
    it('should create a new list successfully', async () => {
      const newList = { name: 'New Shopping List' };
      const mockResponse = { id: 1, ...newList };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await ListService.createList(newList);
      
      expect(api.post).toHaveBeenCalledWith('/lists', newList);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when creating list fails', async () => {
      const errorMessage = 'Invalid data';
      api.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.createList({})).rejects.toThrow(errorMessage);
      expect(api.post).toHaveBeenCalledWith('/lists', {});
    });
  });

  describe('updateList', () => {
    it('should update a list successfully', async () => {
      const listId = 1;
      const updateData = { name: 'Updated List' };
      const mockResponse = { id: listId, ...updateData };
      api.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await ListService.updateList(listId, updateData);
      
      expect(api.put).toHaveBeenCalledWith(`/lists/${listId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when updating list fails', async () => {
      const errorMessage = 'Update failed';
      api.put.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.updateList(1, {})).rejects.toThrow(errorMessage);
      expect(api.put).toHaveBeenCalledWith('/lists/1', {});
    });
  });

  describe('deleteList', () => {
    it('should delete a list successfully', async () => {
      api.delete.mockResolvedValueOnce({});

      await ListService.deleteList(1);
      
      expect(api.delete).toHaveBeenCalledWith('/lists/1');
    });

    it('should handle error when deleting list fails', async () => {
      const errorMessage = 'Delete failed';
      api.delete.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.deleteList(1)).rejects.toThrow(errorMessage);
      expect(api.delete).toHaveBeenCalledWith('/lists/1');
    });
  });

  describe('shareList', () => {
    it('should share a list successfully', async () => {
      const listId = 1;
      const shareData = { username: 'user1', permissionLevel: 'read' };
      const mockResponse = { success: true };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await ListService.shareList(listId, shareData.username, shareData.permissionLevel);
      
      expect(api.post).toHaveBeenCalledWith(`/lists/${listId}/share`, shareData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when sharing list fails', async () => {
      const errorMessage = 'Share failed';
      api.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.shareList(1, 'user1', 'read')).rejects.toThrow(errorMessage);
    });
  });

  describe('unshareList', () => {
    it('should unshare a list successfully', async () => {
      const listId = 1;
      const userId = 'user1';
      const mockResponse = { success: true };
      api.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await ListService.unshareList(listId, userId);
      
      expect(api.delete).toHaveBeenCalledWith(`/lists/${listId}/unshare`, { data: { userId } });
      expect(result).toEqual(mockResponse);
    });

    it('should handle error when unsharing list fails', async () => {
      const errorMessage = 'Unshare failed';
      api.delete.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(ListService.unshareList(1, 'user1')).rejects.toThrow(errorMessage);
    });
  });

  describe('Product operations', () => {
    describe('addProductToList', () => {
      it('should add a product to list successfully', async () => {
        const listId = 1;
        const productData = { name: 'New Product', quantity: 1 };
        const mockResponse = { id: 1, ...productData };
        api.post.mockResolvedValueOnce({ data: mockResponse });

        const result = await ListService.addProductToList(listId, productData);
        
        expect(api.post).toHaveBeenCalledWith(`/lists/${listId}/products`, productData);
        expect(result).toEqual(mockResponse);
      });

      it('should handle error when adding product fails', async () => {
        const errorMessage = 'Add product failed';
        api.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

        await expect(ListService.addProductToList(1, {})).rejects.toThrow(errorMessage);
      });
    });

    describe('updateProductInList', () => {
      it('should update a product in list successfully', async () => {
        const listId = 1;
        const productId = 1;
        const updateData = { quantity: 2 };
        const mockResponse = { id: productId, ...updateData };
        api.put.mockResolvedValueOnce({ data: mockResponse });

        const result = await ListService.updateProductInList(listId, productId, updateData);
        
        expect(api.put).toHaveBeenCalledWith(`/lists/${listId}/products/${productId}`, updateData);
        expect(result).toEqual(mockResponse);
      });

      it('should handle error when updating product fails', async () => {
        const errorMessage = 'Update product failed';
        api.put.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

        await expect(ListService.updateProductInList(1, 1, {})).rejects.toThrow(errorMessage);
      });
    });

    describe('removeProductFromList', () => {
      it('should remove a product from list successfully', async () => {
        const listId = 1;
        const productId = 1;
        const mockResponse = { success: true };
        api.delete.mockResolvedValueOnce({ data: mockResponse });

        const result = await ListService.removeProductFromList(listId, productId);
        
        expect(api.delete).toHaveBeenCalledWith(`/lists/${listId}/products/${productId}`);
        expect(result).toEqual(mockResponse);
      });

      it('should handle error when removing product fails', async () => {
        const errorMessage = 'Remove product failed';
        api.delete.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

        await expect(ListService.removeProductFromList(1, 1)).rejects.toThrow(errorMessage);
      });
    });
  });
}); 