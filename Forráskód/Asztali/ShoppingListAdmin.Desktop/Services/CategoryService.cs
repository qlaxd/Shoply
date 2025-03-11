using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class CategoryService
    {
        private readonly HttpClient _httpClient;

        public CategoryService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<CategoryModel>> GetAllCategoriesAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<CategoryModel>>("api/categories");
        }

        public async Task CreateCategoryAsync(CategoryModel category)
        {
            await _httpClient.PostAsJsonAsync("api/categories", category);
        }

        public async Task UpdateCategoryAsync(string categoryId, CategoryModel category)
        {
            await _httpClient.PutAsJsonAsync($"api/categories/{categoryId}", category);
        }

        public async Task DeleteCategoryAsync(string categoryId)
        {
            await _httpClient.DeleteAsync($"api/categories/{categoryId}");
        }
    }
}